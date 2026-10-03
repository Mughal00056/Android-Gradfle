import React, { useState, useEffect } from 'react';
import { 
  Bell, Check, ChevronRight, Compass, Heart, Home, 
  Layers, MessageSquare, Play, Plus, Search, Settings, Share2, Star, User
} from 'lucide-react';

interface XmlLayoutRendererProps {
  xmlContent: string;
  theme: 'dark' | 'light';
  onShowToast: (message: string) => void;
}

interface ParsedNode {
  tag: string;
  id?: string;
  text?: string;
  textColor?: string;
  textSize?: string;
  background?: string;
  orientation?: 'vertical' | 'horizontal';
  hint?: string;
  checked?: boolean;
  children: ParsedNode[];
  rawAttributes: Record<string, string>;
}

// Lightweight XML Layout Parser for Android views
function parseAndroidXml(xml: string): ParsedNode {
  // Fallback default node
  const rootNode: ParsedNode = {
    tag: 'LinearLayout',
    orientation: 'vertical',
    children: [],
    rawAttributes: {},
  };

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    
    // Check for parse error
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      return {
        tag: 'ErrorView',
        text: 'XML Syntax Error: ' + (parserError.textContent?.slice(0, 100) || 'Check tags'),
        children: [],
        rawAttributes: {},
      };
    }

    function domToNode(element: Element): ParsedNode {
      const tag = element.tagName.replace(/^[a-zA-Z0-9_.]*:/, '');
      const rawAttributes: Record<string, string> = {};
      
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        rawAttributes[attr.name] = attr.value;
      }

      const id = rawAttributes['android:id']?.replace('@+id/', '') || rawAttributes['id'];
      const text = rawAttributes['android:text'] || rawAttributes['text'];
      const textColor = rawAttributes['android:textColor'];
      const textSize = rawAttributes['android:textSize'];
      const background = rawAttributes['android:background'];
      const orientation = (rawAttributes['android:orientation'] as 'vertical' | 'horizontal') || 'vertical';
      const hint = rawAttributes['android:hint'];
      const checked = rawAttributes['android:checked'] === 'true';

      const children: ParsedNode[] = [];
      for (let i = 0; i < element.children.length; i++) {
        children.push(domToNode(element.children[i]));
      }

      return {
        tag,
        id,
        text,
        textColor,
        textSize,
        background,
        orientation,
        hint,
        checked,
        children,
        rawAttributes,
      };
    }

    if (doc.documentElement) {
      return domToNode(doc.documentElement);
    }
  } catch (err) {
    console.error('XML parse error', err);
  }

  return rootNode;
}

export const XmlLayoutRenderer: React.FC<XmlLayoutRendererProps> = ({
  xmlContent,
  theme,
  onShowToast,
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [switchState, setSwitchState] = useState(true);
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'notifications' | 'profile'>('home');
  const [parsedRoot, setParsedRoot] = useState<ParsedNode | null>(null);

  useEffect(() => {
    const root = parseAndroidXml(xmlContent);
    setParsedRoot(root);
  }, [xmlContent]);

  const handleButtonClick = (btnText?: string, id?: string) => {
    setClickCount((prev) => {
      const next = prev + 1;
      onShowToast(`onClick: ${btnText || id || 'Button'} (count: ${next})`);
      return next;
    });
  };

  const isDark = theme === 'dark';

  if (!parsedRoot) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 text-sm">
        Parsing XML Layout...
      </div>
    );
  }

  if (parsedRoot.tag === 'ErrorView') {
    return (
      <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-200 text-xs font-mono m-4">
        <div className="font-bold text-red-400 mb-1">Layout Parsing Error</div>
        <div>{parsedRoot.text}</div>
      </div>
    );
  }

  // Render node recursively
  const renderNode = (node: ParsedNode, key: string): React.ReactNode => {
    const tag = node.tag.toLowerCase();

    // Map common Android colors
    const resolveColor = (color?: string) => {
      if (!color) return undefined;
      if (color.startsWith('#')) return color;
      if (color.includes('white')) return '#ffffff';
      if (color.includes('black')) return '#000000';
      return color;
    };

    if (tag.includes('linearlayout') || tag.includes('relativelayout') || tag.includes('constraintlayout') || tag.includes('framelayout')) {
      const isHorizontal = node.orientation === 'horizontal';
      const bg = resolveColor(node.background);

      return (
        <div
          key={key}
          style={{ backgroundColor: bg }}
          className={`flex ${isHorizontal ? 'flex-row items-center gap-3' : 'flex-col gap-3'} ${
            node.background ? 'rounded-xl' : ''
          }`}
        >
          {node.children.map((child, i) => renderNode(child, `${key}-${i}`))}
        </div>
      );
    }

    if (tag.includes('textview')) {
      const displayText = node.id === 'tvTitle' && clickCount > 0
        ? `Button clicked ${clickCount} time${clickCount > 1 ? 's' : ''}`
        : node.text || 'TextView';

      return (
        <div
          key={key}
          style={{
            color: resolveColor(node.textColor),
            fontSize: node.textSize ? node.textSize.replace('sp', 'px') : undefined,
          }}
          className={`leading-snug ${node.rawAttributes['android:textStyle'] === 'bold' ? 'font-bold' : ''} ${
            !node.textColor ? (isDark ? 'text-slate-100' : 'text-slate-900') : ''
          }`}
        >
          {displayText}
        </div>
      );
    }

    if (tag.includes('button') || tag.includes('materialbutton')) {
      const isFab = tag.includes('floatingactionbutton') || node.id?.toLowerCase().includes('fab');
      const bg = resolveColor(node.background) || '#38BDF8';
      const textColor = resolveColor(node.textColor) || (isDark ? '#0F172A' : '#FFFFFF');

      if (isFab) {
        return (
          <button
            key={key}
            onClick={() => handleButtonClick(node.text, node.id)}
            style={{ backgroundColor: bg, color: textColor }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-lg font-semibold text-sm active:scale-95 transition-transform"
          >
            <Plus className="w-5 h-5" />
            <span>{node.text || 'Floating Action'}</span>
          </button>
        );
      }

      return (
        <button
          key={key}
          onClick={() => handleButtonClick(node.text, node.id)}
          style={{ backgroundColor: bg, color: textColor }}
          className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-current opacity-80" />
          <span>{node.text || 'Button'}</span>
        </button>
      );
    }

    if (tag.includes('switch') || tag.includes('switchcompat')) {
      return (
        <button
          key={key}
          onClick={() => {
            setSwitchState(!switchState);
            onShowToast(`Switch toggled: ${!switchState ? 'ON' : 'OFF'}`);
          }}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            switchState ? 'bg-sky-500' : isDark ? 'bg-slate-700' : 'bg-slate-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              switchState ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      );
    }

    if (tag.includes('edittext')) {
      return (
        <div key={key} className="w-full">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={node.hint || 'Enter text here...'}
            className={`w-full py-2.5 px-3.5 rounded-xl border text-sm outline-none transition-colors ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-sky-500'
                : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-sky-600'
            }`}
          />
        </div>
      );
    }

    if (tag.includes('imageview')) {
      return (
        <div
          key={key}
          className={`h-24 w-full rounded-xl flex items-center justify-center ${
            isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
          }`}
        >
          <Layers className="w-8 h-8 opacity-70" />
        </div>
      );
    }

    // Default fallback container
    return (
      <div key={key} className="flex flex-col gap-2">
        {node.children.map((child, i) => renderNode(child, `${key}-${i}`))}
      </div>
    );
  };

  return (
    <div className={`h-full flex flex-col justify-between overflow-y-auto no-scrollbar ${
      isDark ? 'bg-[#0F172A] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      {/* Scrollable Layout Content */}
      <div className="p-4 flex flex-col gap-3">
        {renderNode(parsedRoot, 'root')}

        {/* Additional simulated demo widgets for comprehensive interactive testing */}
        <div className={`mt-2 p-3.5 rounded-xl border ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
            <span>androidx.recyclerview: 3 Sample Items</span>
            <span className="text-sky-400">Match Parent</span>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { title: 'Gradle Build Pipeline', desc: 'Version 8.13 with Termux AAPT2 override', icon: Star },
              { title: 'Android Manifest Verified', desc: 'Exported MainActivity with launcher action', icon: Check },
              { title: 'SDK Toolchain 36.1.0', desc: 'NDK 29.0 & CMake 4.1.2 active', icon: Compass },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => onShowToast(`RecyclerView item clicked: ${item.title}`)}
                className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors active:scale-98 ${
                  isDark ? 'hover:bg-slate-800 bg-slate-800/40' : 'hover:bg-slate-50 bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium">{item.title}</div>
                    <div className="text-[10px] text-slate-400">{item.desc}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Material 3 Bottom Navigation Bar simulation */}
      <div className={`shrink-0 border-t py-2 px-3 flex items-center justify-around ${
        isDark ? 'bg-slate-900/95 border-slate-800 text-slate-400' : 'bg-white/95 border-slate-200 text-slate-500'
      }`}>
        <button
          onClick={() => {
            setActiveTab('home');
            onShowToast('Navigated to Home Fragment');
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] ${
            activeTab === 'home' ? 'text-sky-400 font-semibold' : 'hover:text-slate-300'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('search');
            onShowToast('Navigated to Search Fragment');
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] ${
            activeTab === 'search' ? 'text-sky-400 font-semibold' : 'hover:text-slate-300'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Explore</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('notifications');
            onShowToast('Navigated to Notifications Fragment');
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] ${
            activeTab === 'notifications' ? 'text-sky-400 font-semibold' : 'hover:text-slate-300'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Alerts</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('profile');
            onShowToast('Navigated to Settings Activity');
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] ${
            activeTab === 'profile' ? 'text-sky-400 font-semibold' : 'hover:text-slate-300'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </div>
    </div>
  );
};

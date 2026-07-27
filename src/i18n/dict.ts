import type { Locale } from './config';

const en = {
  nav: {
    docs: 'Documentation',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
  },
  home: {
    badge: 'Open Source',
    tagline: 'Modern Documentation Platform',
    description:
      'Build beautiful, fast, and accessible documentation sites with AI-powered search, internationalization, and a great developer experience.',
    getStarted: 'Get Started',
    viewSource: 'View Source',
  },
  features: {
    title: 'Why Choose Us',
    aiSearch: {
      title: 'AI-Powered Search',
      description: 'Find answers instantly with intelligent AI search that understands your questions in natural language.',
    },
    i18n: {
      title: 'Internationalization',
      description: 'Built-in multi-language support to reach a global audience with localized content.',
    },
    fast: {
      title: 'Lightning Fast',
      description: 'Static generation and optimized performance ensure your docs load instantly.',
    },
    customizable: {
      title: 'Fully Customizable',
      description: 'Tailor every aspect of your documentation with a flexible component system.',
    },
  },
  cta: {
    title: 'Ready to Get Started?',
    description: 'Explore our documentation and start building amazing projects today.',
    button: 'Read the Docs',
  },
  footer: {
    rights: 'All rights reserved.',
    legal: 'Legal',
  },
};

const zh: typeof en = {
  nav: {
    docs: '文档',
    privacy: '隐私政策',
    terms: '用户协议',
  },
  home: {
    badge: '开源项目',
    tagline: '现代化文档平台',
    description: '使用 AI 驱动搜索、国际化和出色的开发者体验，构建美观、快速、无障碍的文档站点。',
    getStarted: '立即开始',
    viewSource: '查看源码',
  },
  features: {
    title: '为什么选择我们',
    aiSearch: {
      title: 'AI 智能搜索',
      description: '通过理解自然语言的智能搜索，即时找到您需要的答案。',
    },
    i18n: {
      title: '国际化支持',
      description: '内置多语言支持，通过本地化内容触达全球用户。',
    },
    fast: {
      title: '极致性能',
      description: '静态生成与性能优化，确保文档瞬间加载。',
    },
    customizable: {
      title: '完全可定制',
      description: '通过灵活的组件系统，定制文档的每一个细节。',
    },
  },
  cta: {
    title: '准备好开始了吗？',
    description: '探索我们的文档，立即开始构建精彩项目。',
    button: '阅读文档',
  },
  footer: {
    rights: '保留所有权利。',
    legal: '法律条款',
  },
};

const dictionaries: Record<Locale, typeof en> = { en, zh };

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries.en;
}

export type Dictionary = ReturnType<typeof getDictionary>;

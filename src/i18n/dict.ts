import type { Locale } from './config';

const en = {
  nav: {
    home: 'Home',
    projects: 'Projects',
    docs: 'Documentation',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    switchLanguage: '中文',
  },
  home: {
    badge: 'Independent Maker Workshop',
    tagline: 'Ideas, crafted into products.',
    description:
      'MakerStudio is an indie maker workshop. We turn everyday problems into fast, polished and privacy-friendly web products — weather alerts, chat rooms, tunnels and campus marketplaces — all shipped from an open, modern stack.',
    primaryCta: 'Explore Projects',
    secondaryCta: 'View on GitHub',
    scrollHint: 'Scroll to explore',
  },
  stats: [
    { value: '4+', label: 'Products online' },
    { value: '2', label: 'Languages served' },
    { value: '100%', label: 'Open source' },
    { value: 'Edge', label: 'Global delivery' },
  ],
  projects: {
    tag: 'Portfolio',
    title: 'Our Projects',
    description:
      'Four focused products, each solving one real problem well. Hover a card to see what is inside.',
    learnMore: 'Learn more',
    featuresLabel: 'Key features',
    items: {
      hwather: {
        name: 'Hwather',
        tagline: 'Modern weather & disaster alert platform',
        features: [
          'Real-time weather & air quality lookup',
          'Earthquake & extreme weather push alerts',
          'Dynamic weather backgrounds & theme switching',
          'Personalized notifications, responsive on every device',
        ],
        tags: ['Weather', 'Alerts', 'PWA'],
      },
      hchat: {
        name: 'Hchat',
        tagline: 'Online multi-user chat rooms',
        features: [
          'Real-time message sync across many users',
          'Perfect for ad-hoc discussions & interest groups',
          'Zero-friction entry — join and start chatting',
          'Extensible room management & identity system',
        ],
        tags: ['Realtime', 'Chat', 'WebSocket'],
      },
      nettool: {
        name: 'NetTool',
        tagline: 'FRP quick-connect tool',
        features: [
          'Download FRP & sign in within seconds',
          'Connects popular providers, less manual config',
          'Spin up tunnels for testing & remote access',
          'Balanced for solo developers & light ops',
        ],
        tags: ['FRP', 'Tunnel', 'DevOps'],
      },
      campustao: {
        name: 'CampusTao',
        tagline: 'Campus second-hand book marketplace',
        features: [
          'Publish textbooks & idle books in seconds',
          'Organized by school, course & major',
          'Lower trade barriers, faster on-campus circulation',
          'Extensible want-to-buy, reviews & recommendations',
        ],
        tags: ['Campus', 'Marketplace', 'Books'],
      },
    },
  },
  workflow: {
    tag: 'Process',
    title: 'From idea to launch',
    description:
      'A tight loop that keeps every project moving — and keeps us honest about what ships.',
    steps: [
      {
        title: 'Ideate',
        description:
          'Every project starts from a real, everyday problem worth solving — not a feature list.',
      },
      {
        title: 'Prototype',
        description:
          'A usable prototype in days, not months. It goes into real hands as early as possible.',
      },
      {
        title: 'Iterate',
        description:
          'Feedback drives refinement. Details, performance and copy all get sharpened each round.',
      },
      {
        title: 'Ship',
        description:
          'Deploy to the edge with CI/CD, monitor it, maintain it. Products should stay alive.',
      },
    ],
  },
  values: {
    tag: 'Principles',
    title: 'Small team, high standards',
    description: 'The rules every MakerStudio product follows, without exception.',
    items: {
      pragmatic: {
        title: 'Pragmatic by default',
        description:
          'Every feature must earn its place. If it does not serve a real use case, it does not ship.',
      },
      polished: {
        title: 'Details matter',
        description:
          'Micro-interactions, motion and typography are part of the product — not decoration afterthoughts.',
      },
      open: {
        title: 'Open by default',
        description:
          'Code, configs and deployment pipelines live in the open, so anyone can learn from or build on them.',
      },
      privacy: {
        title: 'Privacy-friendly',
        description:
          'Collect the minimum data required. No tracking, no resale, no dark patterns — ever.',
      },
    },
  },
  stack: {
    tag: 'Toolchain',
    title: 'Built on a modern stack',
    description: 'Type-safe end to end, styled with utility CSS, delivered from the edge.',
    items: [
      { name: 'Next.js', label: 'App framework' },
      { name: 'React 19', label: 'UI runtime' },
      { name: 'TypeScript', label: 'Type safety' },
      { name: 'Tailwind CSS', label: 'Styling' },
      { name: 'Fumadocs', label: 'Docs & content' },
      { name: 'Cloudflare', label: 'Edge hosting' },
    ],
  },
  cta: {
    title: 'Have an idea worth building?',
    description:
      'We are always exploring new problems. Follow the repos, read the docs, or start a conversation.',
    primary: 'Read the Docs',
    secondary: 'GitHub',
  },
  footer: {
    rights: 'All rights reserved.',
    tagline: 'Crafted with care, deployed to the edge.',
    product: 'Products',
    resources: 'Resources',
    language: 'Language',
  },
};

const zh: typeof en = {
  nav: {
    home: '首页',
    projects: '项目',
    docs: '文档',
    privacy: '隐私政策',
    terms: '用户协议',
    switchLanguage: 'English',
  },
  home: {
    badge: '独立开发者工作坊',
    tagline: '把想法，打磨成产品。',
    description:
      'MakerStudio 是一个独立开发者工作坊。我们把日常生活中的真实问题，做成快速、精致、尊重隐私的网络产品——天气预警、多人聊天、内网穿透与校园二手书市场——全部构建于开放、现代的技术栈之上。',
    primaryCta: '探索项目',
    secondaryCta: '查看 GitHub',
    scrollHint: '向下滚动浏览',
  },
  stats: [
    { value: '4+', label: '在线产品' },
    { value: '2', label: '支持语言' },
    { value: '100%', label: '开源开放' },
    { value: '边缘', label: '全球分发' },
  ],
  projects: {
    tag: '作品集',
    title: '项目展示',
    description: '四个专注的产品，各自解决一个真实问题。悬停卡片，看看里面都有什么。',
    learnMore: '了解更多',
    featuresLabel: '核心功能',
    items: {
      hwather: {
        name: 'Hwather',
        tagline: '现代化天气与灾害预警平台',
        features: [
          '实时天气与空气质量查询',
          '地震及极端天气预警推送',
          '动态天气背景与主题切换',
          '个性化通知与多端响应式适配',
        ],
        tags: ['天气', '预警', 'PWA'],
      },
      hchat: {
        name: 'Hchat',
        tagline: '在线多人聊天室',
        features: [
          '多人实时消息同步',
          '适合临时讨论与兴趣群聊',
          '低门槛，进入即聊',
          '可扩展房间管理与身份体系',
        ],
        tags: ['实时', '聊天', 'WebSocket'],
      },
      nettool: {
        name: 'NetTool',
        tagline: 'FRP 快速连接工具',
        features: [
          '支持 FRP 下载与快速登录',
          '连通常用服务商，减少手动配置',
          '快速构建隧道，适合测试与远程访问',
          '兼顾个人开发与轻量运维',
        ],
        tags: ['FRP', '隧道', '运维'],
      },
      campustao: {
        name: '校书淘 CampusTao',
        tagline: '校园二手书交易平台',
        features: [
          '支持教材与闲置书快速发布',
          '按学校、课程与专业组织信息',
          '降低交易门槛，提升校内流通效率',
          '可延展求购、评价与推荐能力',
        ],
        tags: ['校园', '交易', '图书'],
      },
    },
  },
  workflow: {
    tag: '流程',
    title: '从想法到上线',
    description: '一个紧凑的循环，让每个项目持续前进——也让我们对交付的东西保持诚实。',
    steps: [
      {
        title: '构思',
        description: '每个项目都从一个值得解决的真实日常问题出发，而不是一张功能清单。',
      },
      {
        title: '原型',
        description: '几天而非几个月拿出可用原型，尽早交到真实用户手中。',
      },
      {
        title: '迭代',
        description: '以反馈驱动打磨。细节、性能与文案，每一轮都被重新雕琢。',
      },
      {
        title: '上线',
        description: '通过 CI/CD 部署到边缘网络，持续监控与维护，让产品保持活力。',
      },
    ],
  },
  values: {
    tag: '原则',
    title: '小团队，高标准',
    description: '每一条 MakerStudio 产品都要遵守的规则，没有例外。',
    items: {
      pragmatic: {
        title: '实用主义',
        description: '每个功能都必须证明自己的价值。不服务于真实场景的功能，不会上线。',
      },
      polished: {
        title: '细节打磨',
        description: '微交互、动效与排版都是产品的一部分，而不是事后补上的装饰。',
      },
      open: {
        title: '默认开放',
        description: '代码、配置与部署流水线全部公开，任何人都可以学习或在之上构建。',
      },
      privacy: {
        title: '尊重隐私',
        description: '只收集必需的最少数据。没有追踪、没有转卖、没有黑暗模式。',
      },
    },
  },
  stack: {
    tag: '工具链',
    title: '现代技术栈',
    description: '端到端类型安全，原子化 CSS 样式，边缘网络分发。',
    items: [
      { name: 'Next.js', label: '应用框架' },
      { name: 'React 19', label: 'UI 运行时' },
      { name: 'TypeScript', label: '类型安全' },
      { name: 'Tailwind CSS', label: '样式系统' },
      { name: 'Fumadocs', label: '文档内容' },
      { name: 'Cloudflare', label: '边缘托管' },
    ],
  },
  cta: {
    title: '有值得做的想法？',
    description: '我们始终在探索新的问题。关注仓库、阅读文档，或者直接开始一场对话。',
    primary: '阅读文档',
    secondary: 'GitHub',
  },
  footer: {
    rights: '保留所有权利。',
    tagline: '用心打造，部署于边缘。',
    product: '产品',
    resources: '资源',
    language: '语言',
  },
};

const dictionaries: Record<Locale, typeof en> = { en, zh };

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries.en;
}

export type Dictionary = ReturnType<typeof getDictionary>;

import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  // 取消打包静态单个组件库和函数工具
  exportStatic: false,
  themeConfig: {
    name: 'dumi2-demo',
    nav: [
      { title: '介绍', link: '/guide' },
      {
        title: '组件',
        link: '/components/Foo',
      },
    ],
  },
  styles: [
    `.dumi-default-header-left {
      width: 220px !important;
    }`,
  ],
});

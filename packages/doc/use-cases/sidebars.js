/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],

  // But you can create a sidebar manually

  tutorialSidebar: [
    {
      type: 'html',
      value: '<img src="/img/doc.svg" width="20em" class="menu_icon" /> Internal Tools',
      className: 'sidebar-title',
    },
    {
      type: 'doc',
      id: 'internal-tools/overview',
    },
    {
      type: 'doc',
      id: 'internal-tools/appsmith',
    },
    {
      type: 'html',
      value: '<br/><br/>',
    },
  ],
};

module.exports = sidebars;

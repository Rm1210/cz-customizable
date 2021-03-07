'use strict';

module.exports = {

  types: [
    {value: '【需求】',  name: '【需求】:  新功能（feature）'},
    {value: '【修复】',  name: '【修复】:  修复bug (尽量在 scope 中带上 Phabricator 中 fix 的 hash id)'},
    {value: '【优化】',  name: '【优化】:  优化（即不是新增功能，也不是修改bug的代码变动）'}
  ],

  scopes: [
    {name: 'Business'},
    {name: 'BusinessMid'},
    {name: 'CrossPlatformBusiness'},
    {name: 'HYTinyConsole'},
    {name: 'LiveBase'},
    {name: 'LiveBusiness'},
    {name: 'LiveMid'},
    {name: 'LiveTemplate'},
    {name: 'BaseBusiness'},
    {name: 'Base'}
  ],

  // it needs to match the value for field type. Eg.: 'fix'
  /*
  scopeOverrides: {
    fix: [

      {name: 'merge'},
      {name: 'style'},
      {name: 'e2eTest'},
      {name: 'unitTest'}
    ]
  },
  */


  forceAuditors: true,
  allowCustomScopes: true
};

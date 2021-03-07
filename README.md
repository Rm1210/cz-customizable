# cz-kiwi-iOS-changelog

新增：根据 `git config user.name` 读取配置文件中对应的 auditors 添加到 commit message 。

可以配置 `forceAuditors: {boolean, default false}` 标识是否强制要求 Auditors 。

## 初始化

1. 安装 [Commitizen](https://github.com/commitizen/cz-cli)：`npm install -g commitizen` 

2. 初始化 package.json ：`npm init --yes` （如果已经存在请忽略）

3. 安装 cz-kiwi-iOS-changelog: `npm install cz-kiwi-iOS-changelog --save-dev`

4. 配置 `commitizen` 使用 `cz-kiwi-iOS-changelog` 作为 adapter。添加如下配置到 `package.json`:

   ```json
   ...
   "config": {
     "commitizen": {
       "path": "node_modules/cz-kiwi-iOS-changelog"
     }
   }
   ```

5. 在 `package.json` 中声明配置文件:

   ```json
   ...
   "config": {
     "commitizen": {
       "path": "node_modules/cz-kiwi-iOS-changelog"
     },
     "cz-customizable": {
       "config": "config/path/to/my/config.js"
     }
   }
   ```

6. 如果在上述配置文件中声明了强制要求 Auditors：`forceAuditors: true`，需要在 `package.json` 中声明 auditors 文件：

```json
  ...
  "config": {
    "commitizen": {
      "path": "node_modules/cz-kiwi-iOS-changelog"
    },
    "cz-customizable": {
      "config": "config/path/to/my/config.js",
      "auditors": "path/to/my/repoAuditors.json"
    }
  }
```

7. 此后，凡是用到`git commit`命令，一律改为使用`git cz`。

## 新增配置项

forceAuditors: {boolean, default false}: 标识是否强制要求 Auditors，如果为 true，需要在 `package.json` 中声明 auditors 文件；如果没有声明，会尝试读取 `repoAuditors.json` 。auditors 文件示例：

```
{
  "Rm1210": ["Mike", "Jim"],
  "Mike": ["Luthi", "Alex"],
  ...
}
```

cz-kiwi-iOS-changelog 会根据 `git config user.name` 匹配对应的 Auditors 。

## 原配置项

1. 如果需要预置 scopes，在配置文件中添加如下配置：

```
scopes: [
    {name: 'accounts'},
    {name: 'admin'},
    {name: 'exampleScope'},    
    {name: 'changeMe'}
  ]
```

2. 如果需要预置针对不同的 commit type 预置不同的 scopes，可以在配置文件中添加如下配置：

```
scopeOverrides: {
    fix: [
      {name: 'merge'},
      {name: 'style'}
    ],
    docs: [
      {name: 'graph'},
      {name: 'markdown'},
    ]
  }
```

更多信息请查阅原 README ☟☟☟☟☟☟☟☟


# cz-customizable

The customizable Commitizen plugin to help achieve consistent commit messages like the [AngularJS team](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines).

![screenshot](/Users/Rm1210/GitHub/cz-customizable/screenshot.png)

Suitable for large teams working with multiple projects with their own commit scopes. When you specify the scopes in your `.cz-config.js`, `cz-customizable` allows you to **select** the pre-defined scopes. No more spelling mistakes embarrassing you when generating the changelog file.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Build Status](https://travis-ci.org/leonardoanalista/cz-customizable.svg)](https://travis-ci.org/leonardoanalista/cz-customizable) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![codecov.io](https://codecov.io/github/leonardoanalista/cz-customizable/coverage.svg?branch=master)](https://codecov.io/github/leonardoanalista/cz-customizable?branch=master) [![npm monthly downloads](https://img.shields.io/npm/dm/cz-customizable.svg?style=flat-square)](https://www.npmjs.com/package/cz-customizable)

## Steps

* install commitizen in case you don't have it: `npm install -g commitizen`. Make sure you have the latest version of commitizen installed globally.

* install the cz-customizable: `npm install cz-customizable --save-dev`

* configure `commitizen` to use `cz-customizable` as plugin. Add those lines to your `package.json`:

  ```
  ...
  "config": {
    "commitizen": {
      "path": "node_modules/cz-customizable"
    }
  }
  ```

## Configure

* Config block in your `package.json`:

  ```
  ...
  "config": {
    "commitizen": {
      "path": "node_modules/cz-customizable"
    },
    "cz-customizable": {
      "config": "config/path/to/my/config.js"
    }
  }
  ```

  Note: option one allows you to have your config away from root directory. It also gives you a change to define any name to your `cz-config.js`.


**Notes:**

* you should commit your `.cz-config.js` file to your git.


From now on, instead of `git commit` you type `git cz` and let the tool do the work for you.

Hopefully this will help you to have consistent commit messages and have a fully automated deployemnt without any human intervention.

## Options

Here are the options you can set in your `.cz-config.js`:

* scopes: {Array of Strings}: Specify the scopes for your particular project. Eg.: for some banking system: ["acccounts", "payments"]. For another travelling application: ["bookings", "search", "profile"]
* scopeOverrides: {Object where key contains a Array of String}: Use this when you want to override scopes for a specific commit type. Example bellow specify scopes when type is `fix`:

```
  scopeOverrides: {
    fix: [
      {name: 'merge'},
      {name: 'style'},
      {name: 'e2eTest'},
      {name: 'unitTest'}
    ]
  }
```

* allowCustomScopes: {boolean, default false}: adds the option `custom` to scope selection so you can still typea scope if you need.
  * allowBreakingChanges: {Array of Strings: default none}. List of commit types you would like to the question `breaking change` prompted. Eg.: ['feat', 'fix']
  * appendBranchNameToCommitMessage: If you use `cz-customizable` with `cz-customizable-ghooks`, you can get the branch name automatically appended to the commit message. This is done by a commit hook on `cz-customizable-ghooks`. This option has been added on `cz-customizable-ghooks`, v1.3.0. Default value is `true`.

## Related tools

- (https://github.com/commitizen/cz-cli)
- (https://github.com/stevemao/conventional-recommended-bump)
- (https://github.com/semantic-release/semantic-release)
- (https://github.com/uglow/cz-customizable-ghooks)



## GOTCHAS

* backticks
  If you wish to have backticks in your content, for example "feat: \`string\`", the commit preview will be "feat: \\\\`string\\\\`".
  Don't worry because on your `git log` will be "feat: \`string\`" as desired.

* multiline contents on the body of the message
  Body is the only place where you can use a `pipe` to break lines.
  E.g.: you type this: `my items are:| - item01| - item 02`, which will become:


```
my items are:
 - item01
 - item 02
```


## CONTRIBUTING

Please refer to:

* [Contributor Guidelines](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md) - disregard section "Signing the CLA"
* [Conduct of Code](https://github.com/angular/code-of-conduct/blob/master/CODE_OF_CONDUCT.md) from [AngularJs](https://github.com/angular/angular.js) project.



Leonardo Correa
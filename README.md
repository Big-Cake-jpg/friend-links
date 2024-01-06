# Big_Cake's Friends

~~窥镜而自视，又弗如远甚。~~

## 前置要求

- **广告 / 大水怪退散！**
  - 「大水怪」意味着：站点内 90% 以上的文章均无实际意义。
- 最好是我比较熟悉的人；
  - 「熟悉」指的是：在过去半年内，我见过你至少五次。
  - 陌生人的 Pull Requests 最终是否合并则取决于我对你的印象。
- 使用合适的域名；
  - 「不合适的域名」指：
    - 由 Freenom 管理的免费域名，如 `.ml` `.tk` `.ga`（不包括付费购买的此类域名）；
    - 与 Coding Pages、Gitee Pages 有关的任何子域名；
    - 其他任何不在 Public Domain Suffix 列表的免费子域名。
- 网站内没有安插有令人不适的内容
    - 示例 1：暴力、血腥、R-18、NSFW 等；
    - 示例 2：非常高对比颜色（这会让人的眼睛很不适）；
    - 示例 3：遍布过多甚至影响正常访问的广告内容；
    - 更详细的「令人不适的内容」的最终解释权归我所有

如果你认为自己符合了要求，就可以提交 Pull Request 了。

## 流程

### 将我的网站添加到你的友链列表中

我的信息如下：

- 链接：https://lihaoyu.cn
- 头像（2360x，WebP）：https://blog-api.lihaoyu.cn/avatar
  - 512x，WebP：https://blog-api.lihaoyu.cn/images/profile/avatar-512x.webp
  - 128x，WebP：https://blog-api.lihaoyu.cn/images/profile/avatar-128x.webp
  - Gravatar E-Mail Hash：636d113ce37111d08f08faee780ce9b8
- 站点名称：晓雨杂记
- 昵称：Big_Cake / 晓雨
- 主题色：#F2BC57
- 描述：也许我们会分别，但我们将永远不会忘记彼此

### 准备好你的网站信息

标准情况下你需要提供昵称、描述、头像链接、主题色、站点名称和网站链接

你的头像应为对称的方形或圆形，否则加载时可能出现一些问题

请确保你提供的信息是适合全年龄段的人群的内容

打开本仓库的 `links.json` 并在最末尾添加你的站点

下述是一个对你有用的示例：
```json
{
    "url": "https://lihaoyu.cn",
    "avatar": "https://blog-api.lihaoyu.cn/avatar",
    "name": "Big_Cake",
    "color": "#F2BC57",
    "blog": "晓雨杂记",
    "desc": "也许我们会分别，但我们将永远不会忘记彼此。"
}
```
> [!IMPORTANT]
> 请严格遵循 JSON 的格式编写。

确认你填写的信息是否无误，并打开一个 Pull Request。

当你的 Pull Request 按流程顺利合并后，你的网站将会即刻显示在我的友链页（或者缓存刷新后）。

## 写在最后

严格来说，一旦最后 Pull Request 顺利合并，你的友链将不会被移除。但是，因下述两种原因，你的友链可能在命中时被我移除：

- 出现了无法访问的问题（例如 404、502、522 等）；
- 在整理友链时不小心丢失数据。

你完全可以在出现这种状况时向我提出重新添加友链的要求，但请在发起 Pull Request 时带上 `#LOST` 的 Tag。

一款自动生存骨架屏的工具

## Install

```bash
$ npm install page-skt -g
```

## Usage
### Example
Step1 执行命令：
```bash
$ skt init
```
在当前目录生成 config.js
```js
{
    url: 'http://www.baidu.com', // 页面地址

    devices: {               // 支持设备类型列表,可扩增设备
        iphone: [375, 667, 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'],
        ipad: [768, 1024, 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1'],
        ipadPro: [1024, 1366, 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1'],
        pc: [1200, 1000, 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1']
    },
    device: 'iphone',        // 默认设备类型
    style: `animation: opacity 1s linear infinite;`, // 骨架动画样式
    background: '#eee', // 骨架填充色
    output: '', //输出路径。默认当前执行目录
    // headers: {  // 配置 header
    //     cookies: [{ // 如果页面需要登陆态，设置 cookie
    //         'name': 'pt_pin',
    //         domain: '.jd.com',
    //         'value': '%E6%88%91%E5%90%83%E5%B0%8F%E8%98%91%E8%8F%87635'
    //     }, {
    //         'name': 'pt_key',
    //         domain: '.jd.com',
    //         'value': 'AAJiEzi8AECSC83BcZNPs3bji3v7LxJVFpr-GMBV9dXDfSCtDK64orA4FUQr9QopjF23IDsERxPlQcTBCEanx8p3JNhcJ2BY'
    //     }],
    // }
}
```

Step2 执行命令：
```bash
$ skt start
```
在当前目录生成 index.html 骨架屏
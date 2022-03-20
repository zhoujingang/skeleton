module.exports = {
    url: 'http://www.baidu.com', // 页面地址
    devices: {               // 支持设备类型列表
        iphone: [375, 667, 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'],
        ipad: [768, 1024, 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1'],
        ipadPro: [1024, 1366, 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1'],
        pc: [1200, 1000, 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1']
    },
    device: 'iphone',        // 默认设备类型
    style: `animation: opacity 1s linear infinite;`,
    background: '#eee',
    output: '',
    cutHeight: 0,
    ignoreBlockByClass: [], // 忽略模块（类名）
    ignoreDomByClass: [], // 忽略单节点（类名匹配）
    ignoreDomById: ['header'], // 忽略单节点 （id匹配）
    // headers: { 
    //     cookies: [{ // 设置 cookie
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
# 通过浏览器扩展满足部长需求
身经百战的销售同事从前线带回来了一个需求。我们的大屏展示的时候，视察的部长领导们想知道**具体的攻击
信息，点击大屏对应的攻击需要弹出到对应的详情页。并且当前大屏不要受到影响**。

    这个问题怎么答？
    
    JS的open感知不到电脑外接了多少屏幕，尝试了一下也不能把打开的窗口投到其他屏幕，只能在当前屏幕。
    无论怎么设置open 的left，top参数，都被浏览器自动屏蔽掉不合理的值。例如设置top：-1000，弹不过去。
    
    那怎么办呢？
    
    
    
##content-script 
好吧，只有寄出大杀器了：插件！   
在content-script里面执行监听页面的操作。
content-script是什么？
content-sciprt 是浏览器插件三大件中的内容脚本，主要用来操作dom。也就是他可以和我们打开的网页共享同一份dom。
所以通过window，他可以和页面通信
    
    window.addEventListener("message", function(event) {
        chrome.runtime.sendMessage(url)
    }）
    
    上面的chrome.runtime.sendMessage是插件的api，通过他可以给BackGround发送消息。
    
## BackGround

background是什么？

他是浏览器插件的背景进程。他的权限比较高，可以访问浏览器很多的资源其中就有chrome.runtime.
上代码吧！
    
    function openTopLeftWindow (cfg, callback) {
      getTopLeftWindow(function(bounds){
        chrome.windows.create(Object.assign(bounds, cfg), callback)
      })
    }
    
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      openTopLeftWindow({url:request.url}, sendResponse)
    })
    
    
上面通过chrome.runtime.onMessage接收到content-script发送的消息。然后调用chrome.windows.create
打开一个新的窗口。
getTopLeftWindow是什么👻？

哈哈，这个是获取最左端屏幕的奥秘。

通过**chrome.system.display.getInfo**获取到屏幕信息。然后来个算法算出左上角的屏幕，开始投射了。



    
    
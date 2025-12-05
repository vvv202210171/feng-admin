class WebSocketService {
    constructor() {
        this.websocket = null;
        this.onOpenCallbackFn = null; // 连接成功时执行的回调
        this.eventListeners = [];
        this.pingInterval = null;  // 用于保存心跳定时器
        this.pingIntervalTime = 30000; // 默认每 30 秒发送一次心跳（你可以根据需求调整）
    }

    // 初始化 WebSocket 连接
    init(key) {
        const wsUrl = `${process.env.VUE_APP_BASE_WS.replace(/\/$/, '')}?token=${key}&type=cs`; // 替换为您的 WebSocket 服务地址
        this.websocket = new WebSocket(wsUrl);

        this.websocket.onopen = () => {
            console.log('WebSocket connected');
            if (this.onOpenCallbackFn) {
                this.onOpenCallbackFn(); // 连接成功时执行的回调
            }
            this.startPing();  // 连接成功后开始发送心跳
        };

        this.websocket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
        };

        this.websocket.onerror = (error) => {
            console.error('WebSocket Error: ', error);
        };

        this.websocket.onclose = () => {
            console.log('WebSocket connection closed');
            this.stopPing();  // 连接关闭时停止心跳
        };
    }

    // 发送消息
    sendMessage(message) {
        console.log("即将发送", message)
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send(JSON.stringify(message));
            console.log('消息发送:', message);
        } else {
            console.error('WebSocket is not connected');
        }
    }

    // 监听 WebSocket 消息
    handleMessage(message) {
        this.eventListeners.forEach((listener) => {
            listener(message); // 将消息传递给注册的监听器
        });
    }
    // 设置连接成功后调用的回调
    setOnOpenCallback(callback) {
        this.onOpenCallbackFn = callback;
    }
    // 注册消息监听器
    addListener(listener) {
        this.eventListeners.push(listener);
    }

    // 移除消息监听器
    removeListener(listener) {
        this.eventListeners = this.eventListeners.filter((item) => item !== listener);
    }

    // 开始定时发送心跳（ping）消息
    startPing() {
        if (this.pingInterval) return;  // 防止重复启动定时器
        this.pingInterval = setInterval(() => {
            if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                this.websocket.send("ping");
                console.log('发送心跳ping');
            }
        }, this.pingIntervalTime);
    }

    // 停止心跳定时器
    stopPing() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
            console.log('停止心跳ping');
        }
    }
}

export default new WebSocketService();

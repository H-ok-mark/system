// 全局共享的图表配置选项
const chartBaseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: 2,
    animation: {
        duration: 500
    },
    layout: {
        padding: 0
    },
    plugins: {
        title: {
            display: true,
            font: {
                size: 16
            },
            padding: {
                top: 10,
                bottom: 10
            }
        }
    }
};
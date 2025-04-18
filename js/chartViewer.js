// 图表查看功能
let modalChart = null;
let originalCharts = {};  // 存储原始图表的引用

// 初始化图表查看功能
function initChartViewer() {
    // 为所有图表容器添加点击事件
    const chartContainers = document.querySelectorAll('.chart-container');
    chartContainers.forEach(container => {
        container.addEventListener('click', function () {
            const canvas = this.querySelector('canvas');
            if (canvas) {
                showChartInModal(canvas);
            }
        });

        // 添加鼠标指针样式和提示信息
        container.style.cursor = 'pointer';
        container.setAttribute('title', '点击查看大图');

        // 添加放大镜图标
        if (!container.querySelector('.zoom-icon')) {
            const zoomIcon = document.createElement('div');
            zoomIcon.className = 'zoom-icon';
            zoomIcon.innerHTML = '<i class="bi bi-zoom-in"></i>';
            zoomIcon.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background-color: rgba(255,255,255,0.7);
                border-radius: 50%;
                padding: 5px;
                z-index: 10;
                font-size: 14px;
            `;
            container.style.position = 'relative';
            container.appendChild(zoomIcon);
        }
    });

    // 监听模态框关闭事件
    const chartViewModal = document.getElementById('chartViewModal');
    if (chartViewModal) {
        // 移除现有的事件监听器，避免重复绑定
        chartViewModal.removeEventListener('hidden.bs.modal', handleModalHidden);
        chartViewModal.addEventListener('hidden.bs.modal', handleModalHidden);
    }
}

// 模态框关闭事件处理
function handleModalHidden() {
    // 只清理模态框图表，不影响原始图表
    if (modalChart) {
        try {
            modalChart.destroy();
        } catch (e) {
            console.warn('清理模态框图表时出错:', e);
        }
        modalChart = null;
    }

    // 不再重新初始化图表查看功能，避免破坏现有图表
    // 不需要 reinitChartViewer 调用
}

// 在模态框中显示图表
function showChartInModal(canvas) {
    // 获取原始图表实例
    let originalChart = getOriginalChart(canvas.id);
    if (!originalChart) return;

    // 设置模态框标题
    let chartTitle = '图表查看';
    if (originalChart.options && originalChart.options.plugins && originalChart.options.plugins.title) {
        chartTitle = originalChart.options.plugins.title.text || chartTitle;
    }
    document.getElementById('chartViewModalLabel').textContent = chartTitle;

    // 获取模态框中的canvas
    const modalCanvas = document.getElementById('modal-chart-canvas');

    // 克隆原始图表配置 (修改此处)
    const modalConfig = {
        type: originalChart.config.type,
        data: JSON.parse(JSON.stringify(originalChart.config.data)),
        options: JSON.parse(JSON.stringify(originalChart.config.options))
    };

    // 特别处理tooltip回调函数，确保正确复制 (添加此段代码)
    if (originalChart.config.options?.plugins?.tooltip?.callbacks?.label) {
        if (!modalConfig.options.plugins) modalConfig.options.plugins = {};
        if (!modalConfig.options.plugins.tooltip) modalConfig.options.plugins.tooltip = {};
        if (!modalConfig.options.plugins.tooltip.callbacks) modalConfig.options.plugins.tooltip.callbacks = {};

        // 直接复制原始回调函数，不进行JSON序列化
        modalConfig.options.plugins.tooltip.callbacks.label = originalChart.config.options.plugins.tooltip.callbacks.label;
    }

    // 特殊处理项目气泡图的颜色
    if (canvas.id === 'project-bubble-chart' && originalChart.chartColors && originalChart.chartBorderColors) {
        const colors = originalChart.chartColors;
        const borderColors = originalChart.chartBorderColors;

        // 新的多数据集气泡图
        if (modalConfig.data.datasets && modalConfig.data.datasets.length > 0) {
            // 为每个数据集应用对应颜色
            modalConfig.data.datasets.forEach((dataset, i) => {
                if (i < colors.length) {
                    dataset.backgroundColor = colors[i];
                    dataset.borderColor = borderColors[i];
                }
            });
        }
    }
    // 调整模态框图表的选项配置
    if (modalConfig.options) {
        // 确保响应式
        modalConfig.options.responsive = true;
        modalConfig.options.maintainAspectRatio = false;

        // 调整字体大小等
        if (modalConfig.options.plugins && modalConfig.options.plugins.title) {
            modalConfig.options.plugins.title.font = modalConfig.options.plugins.title.font || {};
            modalConfig.options.plugins.title.font.size = 18; // 放大标题字体
        }
    }

    // 显示模态框
    const modal = new bootstrap.Modal(document.getElementById('chartViewModal'));
    modal.show();

    // 在模态框显示后创建图表
    setTimeout(() => {
        if (modalChart) {
            modalChart.destroy();
        }

        const ctx = modalCanvas.getContext('2d');
        modalChart = new Chart(ctx, modalConfig);
    }, 300);
}

// 保存原始图表引用
function saveOriginalChart(canvas) {
    switch (canvas.id) {
        case 'radar-chart':
            originalCharts['radar-chart'] = window.radarChart;
            break;
        case 'pie-chart':
            originalCharts['pie-chart'] = window.pieChart;
            break;
        case 'line-chart':
            originalCharts['line-chart'] = window.lineChart;
            break;
        case 'histogram-chart':
            originalCharts['histogram-chart'] = window.histogramChart;
            break;
        case 'project-histogram-chart':
            originalCharts['project-histogram-chart'] = window.projectHistogramChart;
            break;
        case 'project-bubble-chart':
            originalCharts['project-bubble-chart'] = window.projectBubbleChart;
            break;
    }
}



// 获取原始图表实例的函数
function getOriginalChart(canvasId) {
    switch (canvasId) {
        case 'radar-chart':
            return window.radarChart;
        case 'pie-chart':
            return window.pieChart;
        case 'line-chart':
            return window.lineChart;
        case 'histogram-chart':
            return window.histogramChart;
        case 'project-histogram-chart':
            return window.projectHistogramChart;
        case 'project-bubble-chart':
            return window.projectBubbleChart;
        default:
            return null;
    }
}

// 在页面加载完成后自动初始化图表查看功能
document.addEventListener('DOMContentLoaded', function () {
    // 在页面加载后延迟初始化，确保所有图表都已渲染
    setTimeout(initChartViewer, 1000);
});

// 添加函数以便在页面内容动态加载后重新初始化
function reinitChartViewer() {
    // 简单地重新调用初始化函数，不破坏现有图表
    setTimeout(initChartViewer, 200);
}
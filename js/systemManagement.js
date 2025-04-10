// 初始化系统管理页面
function initSystemManagement() {
    // 获取系统信息元素
    const browserInfoElement = document.getElementById('browser-info');
    const osInfoElement = document.getElementById('os-info');
    const screenInfoElement = document.getElementById('screen-info');

    // 获取数据操作按钮
    const exportDataBtn = document.getElementById('export-data-btn');
    const importDataBtn = document.getElementById('import-data-btn');
    const clearDataBtn = document.getElementById('clear-data-btn');

    // 显示系统信息
    if (browserInfoElement) {
        browserInfoElement.textContent = getBrowserInfo();
    }

    if (osInfoElement) {
        osInfoElement.textContent = getOSInfo();
    }

    if (screenInfoElement) {
        screenInfoElement.textContent = `${window.screen.width} x ${window.screen.height}`;
    }

    // 导出数据
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', function () {
            const data = exportAllData();
            downloadJSON(data, '遥感原理与应用考核评价系统数据.json');
        });
    }

    // 导入数据
    if (importDataBtn) {
        importDataBtn.addEventListener('click', function () {
            // 创建文件输入元素
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json';

            fileInput.addEventListener('change', function (e) {
                if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const reader = new FileReader();

                    reader.onload = function (e) {
                        try {
                            const imported = importAllData(e.target.result);
                            if (imported) {
                                alert('数据导入成功，请刷新页面');
                                window.location.reload();
                            } else {
                                alert('数据导入失败，请检查文件格式');
                            }
                        } catch (error) {
                            alert('数据导入出错: ' + error.message);
                        }
                    };

                    reader.readAsText(file);
                }
            });

            // 触发文件选择
            fileInput.click();
        });
    }

    // 清空数据
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', function () {
            if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
                clearAllData();
                alert('所有数据已清空，请刷新页面');
                window.location.reload();
            }
        });
    }
}

// 获取浏览器信息
function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = '';

    if (userAgent.indexOf('Firefox') > -1) {
        browserName = 'Firefox';
        browserVersion = userAgent.match(/Firefox\/([\d.]+)/)[1];
    } else if (userAgent.indexOf('Chrome') > -1) {
        browserName = 'Chrome';
        browserVersion = userAgent.match(/Chrome\/([\d.]+)/)[1];
    } else if (userAgent.indexOf('Safari') > -1) {
        browserName = 'Safari';
        browserVersion = userAgent.match(/Version\/([\d.]+)/)[1];
    } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) {
        browserName = 'Internet Explorer';
        browserVersion = userAgent.match(/(?:MSIE |rv:)([\d.]+)/)[1];
    } else if (userAgent.indexOf('Edge') > -1) {
        browserName = 'Microsoft Edge';
        browserVersion = userAgent.match(/Edge\/([\d.]+)/)[1];
    }

    return `${browserName} ${browserVersion}`;
}

// 获取操作系统信息
function getOSInfo() {
    const userAgent = navigator.userAgent;
    let osName = 'Unknown';

    if (userAgent.indexOf('Windows') > -1) {
        osName = 'Windows';
        if (userAgent.indexOf('Windows NT 10.0') > -1) osName += ' 10';
        else if (userAgent.indexOf('Windows NT 6.3') > -1) osName += ' 8.1';
        else if (userAgent.indexOf('Windows NT 6.2') > -1) osName += ' 8';
        else if (userAgent.indexOf('Windows NT 6.1') > -1) osName += ' 7';
    } else if (userAgent.indexOf('Mac') > -1) {
        osName = 'macOS';
    } else if (userAgent.indexOf('Linux') > -1) {
        osName = 'Linux';
    } else if (userAgent.indexOf('Android') > -1) {
        osName = 'Android';
    } else if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) {
        osName = 'iOS';
    }

    return osName;
}

// 下载JSON文件
function downloadJSON(content, fileName) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(content);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
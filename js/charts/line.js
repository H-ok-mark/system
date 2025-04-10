// 折线图 - 单元成绩
function createLineChart(studentId) {
    const canvas = document.getElementById('line-chart');

    // 清除现有图表
    if (window.lineChart) {
        window.lineChart.destroy();
    }

    // 获取学生成绩数据
    const grade = getGradeByStudentId(studentId);
    if (!grade) {
        // 如果没有成绩数据，显示空图表
        window.lineChart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: ['暂无数据'],
                datasets: [{
                    data: [0],
                    backgroundColor: 'rgba(0, 0, 0, 0.1)'
                }]
            },
            options: {
                ...chartBaseOptions, // 使用全局基础配置
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: '模块化技能成绩 - 暂无数据',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
        return;
    }

    // 单元成绩标签
    const labels = [
        '遥感基础知识',
        '无人机数据获取遥感',
        '几何校正',
        '辐射校正',
        '图像配准',
        '目视解译',
        '变化监测',
        '图像分类',
        '精度评价',
        '专题制图'
    ];

    // 单元成绩数据
    const unitScores = [
        grade.unitBasic || 0,
        grade.unitDrone || 0,
        grade.unitGeometric || 0,
        grade.unitRadiometric || 0,
        grade.unitRegistration || 0,
        grade.unitVisual || 0,
        grade.unitChange || 0,
        grade.unitClassification || 0,
        grade.unitAccuracy || 0,
        grade.unitMapping || 0
    ];

    // 数据集
    const data = {
        labels: labels,
        datasets: [{
            label: '成绩',
            data: unitScores,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            pointBackgroundColor: 'rgb(75, 192, 192)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(75, 192, 192)'
        }]
    };

    // 配置选项
    const options = {
        ...chartBaseOptions, // 使用全局基础配置
        scales: {
            y: {
                beginAtZero: true,
                min: 40,
                max: 100,
                title: {
                    display: true,
                    // text: '分数'
                }
            },
            x: {
                title: {
                    display: true,
                    // text: '课程单元'
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: '模块化技能成绩',
                font: {
                    size: 16
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.parsed.y}分`;
                    }
                }
            }
        }
    };

    // 创建图表
    window.lineChart = new Chart(canvas, {
        type: 'line',
        data: data,
        options: options
    });
}

// 创建班级单元成绩折线图
function createClassLineChart(className) {
    const canvas = document.getElementById('line-chart');

    // 清除现有图表
    if (window.lineChart) {
        window.lineChart.destroy();
    }

    // 获取班级学生
    const students = getStudentsByClass(className);
    if (!students || students.length === 0) {
        // 如果班级没有学生，显示空图表
        window.lineChart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: ['暂无数据'],
                datasets: [{
                    data: [0],
                    backgroundColor: 'rgba(0, 0, 0, 0.1)'
                }]
            },
            options: {
                ...chartBaseOptions, // 使用全局基础配置
                plugins: {
                    title: {
                        display: true,
                        text: '班级模块化技能成绩 - 暂无数据',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
        return;
    }

    // 获取班级所有学生的成绩
    const grades = [];
    students.forEach(student => {
        const grade = getGradeByStudentId(student.id);
        if (grade) {
            grades.push(grade);
        }
    });

    if (grades.length === 0) {
        // 如果没有成绩数据，显示空图表
        window.lineChart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: ['暂无数据'],
                datasets: [{
                    data: [0],
                    backgroundColor: 'rgba(0, 0, 0, 0.1)'
                }]
            },
            options: {
                ...chartBaseOptions, // 使用全局基础配置
                plugins: {
                    title: {
                        display: true,
                        text: '班级模块化技能成绩 - 暂无数据',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
        return;
    }

    // 单元成绩标签
    const labels = [
        '遥感基础知识',
        '无人机数据获取遥感',
        '几何校正',
        '辐射校正',
        '图像配准',
        '目视解译',
        '变化监测',
        '图像分类',
        '精度评价',
        '专题制图'
    ];

    // 计算平均单元成绩
    const unitAvgScores = Array(10).fill(0);
    grades.forEach(grade => {
        unitAvgScores[0] += grade.unitBasic || 0;
        unitAvgScores[1] += grade.unitDrone || 0;
        unitAvgScores[2] += grade.unitGeometric || 0;
        unitAvgScores[3] += grade.unitRadiometric || 0;
        unitAvgScores[4] += grade.unitRegistration || 0;
        unitAvgScores[5] += grade.unitVisual || 0;
        unitAvgScores[6] += grade.unitChange || 0;
        unitAvgScores[7] += grade.unitClassification || 0;
        unitAvgScores[8] += grade.unitAccuracy || 0;
        unitAvgScores[9] += grade.unitMapping || 0;
    });

    // 计算平均值
    for (let i = 0; i < unitAvgScores.length; i++) {
        unitAvgScores[i] = unitAvgScores[i] / grades.length;
    }

    // 数据集
    const data = {
        labels: labels,
        datasets: [{
            label: '班级平均成绩',
            data: unitAvgScores,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            pointBackgroundColor: 'rgb(75, 192, 192)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(75, 192, 192)'
        }]
    };

    // 配置选项
    const options = {
        ...chartBaseOptions, // 使用全局基础配置
        scales: {
            y: {
                beginAtZero: true,
                min: 40,
                max: 100,
                title: {
                    display: true,
                    // text: '分数'
                }
            },
            x: {
                title: {
                    display: true,
                    // text: '课程单元'
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: `${className} - 班级模块化技能成绩`,
                font: {
                    size: 16
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}分`;
                    }
                }
            }
        }
    };

    // 创建图表
    window.lineChart = new Chart(canvas, {
        type: 'line',
        data: data,
        options: options
    });
}
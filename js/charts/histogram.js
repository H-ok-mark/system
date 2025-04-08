// 直方图 - 学习资源使用情况
function createHistogram(studentId) {
    const canvas = document.getElementById('histogram-chart');

    // 清除现有图表
    if (window.histogramChart) {
        window.histogramChart.destroy();
    }

    // 获取学生成绩数据
    const grade = getGradeByStudentId(studentId);
    if (!grade) {
        // 如果没有成绩数据，显示空图表
        window.histogramChart = new Chart(canvas, {
            type: 'bar',
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
                        text: '学习资源使用情况 - 暂无数据',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
        return;
    }

    // 数据
    const data = {
        labels: ['学习资源使用次数', '实验完成时间(分钟)'],
        datasets: [{
            label: '数值',
            data: [
                grade.resourceUsage || 0,
                grade.experimentTime || 0
            ],
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
        }]
    };

    // 配置选项
    const options = {
        ...chartBaseOptions, // 使用全局基础配置
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: '数值'
                }
            },
            x: {
                title: {
                    display: true,
                    text: '指标'
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: '学习资源使用情况',
                font: {
                    size: 16
                }
            },
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.raw || 0;
                        const dataIndex = context.dataIndex;
                        return dataIndex === 0 ?
                            `学习资源使用次数: ${value}次` :
                            `实验完成时间: ${value}分钟`;
                    }
                }
            }
        }
    };

    // 创建图表
    window.histogramChart = new Chart(canvas, {
        type: 'bar',
        data: data,
        options: options
    });
}

// 创建班级学习资源使用情况直方图
function createClassHistogram(className) {
    const canvas = document.getElementById('histogram-chart');

    // 清除现有图表
    if (window.histogramChart) {
        window.histogramChart.destroy();
    }

    // 获取班级学生
    const students = getStudentsByClass(className);
    if (!students || students.length === 0) {
        // 如果班级没有学生，显示空图表
        window.histogramChart = new Chart(canvas, {
            type: 'bar',
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
                        text: '班级学习资源使用情况 - 暂无数据',
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
        window.histogramChart = new Chart(canvas, {
            type: 'bar',
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
                        text: '班级学习资源使用情况 - 暂无数据',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
        return;
    }

    // 计算平均值
    let totalResourceUsage = 0, totalExperimentTime = 0;
    grades.forEach(grade => {
        totalResourceUsage += grade.resourceUsage || 0;
        totalExperimentTime += grade.experimentTime || 0;
    });

    const avgResourceUsage = totalResourceUsage / grades.length;
    const avgExperimentTime = totalExperimentTime / grades.length;

    // 创建学生资源使用情况分布
    const resourceUsages = grades.map(grade => grade.resourceUsage || 0);
    const experimentTimes = grades.map(grade => grade.experimentTime || 0);

    // 数据
    const data = {
        labels: students.map(student => student.name),
        datasets: [
            {
                label: '学习资源使用次数',
                data: resourceUsages,
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: '实验完成时间(分钟)',
                data: experimentTimes,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }
        ]
    };

    // 配置选项
    const options = {
        ...chartBaseOptions, // 使用全局基础配置
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: '数值'
                }
            },
            x: {
                title: {
                    display: true,
                    text: '学生'
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: `${className} - 班级学习资源使用情况`,
                font: {
                    size: 16
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.dataset.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value}`;
                    }
                }
            }
        }
    };

    // 创建图表
    window.histogramChart = new Chart(canvas, {
        type: 'bar',
        data: data,
        options: options
    });
}
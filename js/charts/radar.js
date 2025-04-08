// 雷达图 - 综合素质评价
function createRadarChart(studentId) {
    const canvas = document.getElementById('radar-chart');

    // 清除现有图表
    if (window.radarChart) {
        window.radarChart.destroy();
    }

    // 获取学生成绩数据
    const grade = getGradeByStudentId(studentId);
    if (!grade) {
        // 如果没有数据，显示空图表
        window.radarChart = new Chart(canvas, {
            type: 'radar',
            data: {
                labels: [
                    '卫星遥感基础理论',
                    '无人机遥感知识',
                    '软件操作技能',
                    '影像解译能力',
                    '规范化技术流程',
                    '团队协作',
                    '自学能力',
                    '职业道德'
                ],
                datasets: [{
                    label: '综合素质评价',
                    data: [0, 0, 0, 0, 0, 0, 0, 0],
                    fill: true,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    pointBackgroundColor: 'rgb(54, 162, 235)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(54, 162, 235)'
                }]
            },
            options: {
                ...chartBaseOptions, // 使用全局基础配置
                elements: {
                    line: {
                        borderWidth: 3
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 5
                    }
                }
            }
        });
        return;
    }

    // 准备数据 - 使用平铺结构的属性
    const data = [
        grade.qualityTheory || 0,
        grade.qualityDrone || 0,
        grade.qualitySoftware || 0,
        grade.qualityInterpretation || 0,
        grade.qualityWorkflow || 0,
        grade.qualityTeamwork || 0,
        grade.qualitySelfLearning || 0,
        grade.qualityEthics || 0
    ];

    // 创建图表
    window.radarChart = new Chart(canvas, {
        type: 'radar',
        data: {
            labels: [
                '卫星遥感基础理论',
                '无人机遥感知识',
                '软件操作技能',
                '影像解译能力',
                '规范化技术流程',
                '团队协作',
                '自学能力',
                '职业道德'
            ],
            datasets: [{
                label: '综合素质评价',
                data: data,
                fill: true,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgb(54, 162, 235)',
                pointBackgroundColor: 'rgb(54, 162, 235)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(54, 162, 235)'
            }]
        },
        options: {
            ...chartBaseOptions, // 使用全局基础配置
            elements: {
                line: {
                    borderWidth: 3
                }
            },
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 5
                }
            }
        }
    });
}

// 班级平均雷达图
function createClassRadarChart(className) {
    const canvas = document.getElementById('radar-chart');

    // 清除现有图表
    if (window.radarChart) {
        window.radarChart.destroy();
    }

    // 获取班级学生
    const students = getStudentsByClass(className);
    if (students.length === 0) {
        // 如果没有学生，显示空图表
        window.radarChart = new Chart(canvas, {
            type: 'radar',
            data: {
                labels: [
                    '卫星遥感基础理论',
                    '无人机遥感知识',
                    '软件操作技能',
                    '影像解译能力',
                    '规范化技术流程',
                    '团队协作',
                    '自学能力',
                    '职业道德'
                ],
                datasets: [{
                    label: '班级平均素质评价',
                    data: [0, 0, 0, 0, 0, 0, 0, 0],
                    fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(255, 99, 132)'
                }]
            },
            options: {
                ...chartBaseOptions, // 使用全局基础配置
                elements: {
                    line: {
                        borderWidth: 3
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 5
                    }
                }
            }
        });
        return;
    }

    // 获取所有学生的成绩
    const grades = [];
    students.forEach(student => {
        const grade = getGradeByStudentId(student.id);
        if (grade) {
            grades.push(grade);
        }
    });

    if (grades.length === 0) {
        // 如果没有成绩数据，显示空图表
        window.radarChart = new Chart(canvas, {
            type: 'radar',
            data: {
                labels: [
                    '卫星遥感基础理论',
                    '无人机遥感知识',
                    '软件操作技能',
                    '影像解译能力',
                    '规范化技术流程',
                    '团队协作',
                    '自学能力',
                    '职业道德'
                ],
                datasets: [{
                    label: '班级平均素质评价',
                    data: [0, 0, 0, 0, 0, 0, 0, 0],
                    fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(255, 99, 132)'
                }]
            },
            options: {
                ...chartBaseOptions, // 使用全局基础配置
                elements: {
                    line: {
                        borderWidth: 3
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 5
                    }
                }
            }
        });
        return;
    }

    // 计算平均值 - 使用平铺结构的属性
    const data = [0, 0, 0, 0, 0, 0, 0, 0];
    grades.forEach(grade => {
        data[0] += grade.qualityTheory || 0;
        data[1] += grade.qualityDrone || 0;
        data[2] += grade.qualitySoftware || 0;
        data[3] += grade.qualityInterpretation || 0;
        data[4] += grade.qualityWorkflow || 0;
        data[5] += grade.qualityTeamwork || 0;
        data[6] += grade.qualitySelfLearning || 0;
        data[7] += grade.qualityEthics || 0;
    });

    for (let i = 0; i < data.length; i++) {
        data[i] = data[i] / grades.length;
    }

    // 创建图表
    window.radarChart = new Chart(canvas, {
        type: 'radar',
        data: {
            labels: [
                '卫星遥感基础理论',
                '无人机遥感知识',
                '软件操作技能',
                '影像解译能力',
                '规范化技术流程',
                '团队协作',
                '自学能力',
                '职业道德'
            ],
            datasets: [{
                label: '班级平均素质评价',
                data: data,
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 99, 132)'
            }]
        },
        options: {
            ...chartBaseOptions, // 使用全局基础配置
            elements: {
                line: {
                    borderWidth: 3
                }
            },
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 5
                }
            }
        }
    });
}
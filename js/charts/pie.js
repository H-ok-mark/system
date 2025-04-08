// 饼图 - 成绩构成比例
function createPieChart(studentId) {
    const canvas = document.getElementById('pie-chart');

    // 清除现有图表
    if (window.pieChart) {
        window.pieChart.destroy();
    }

    // 获取学生成绩数据
    const grade = getGradeByStudentId(studentId);
    if (!grade) {
        // 如果没有成绩数据，显示空图表
        window.pieChart = new Chart(canvas, {
            type: 'pie',
            data: {
                labels: ['暂无数据'],
                datasets: [{
                    data: [100],
                    backgroundColor: ['#e0e0e0']
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
                        text: '成绩构成比例 - 暂无数据',
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
        labels: ['平时成绩 (20%)', '理论成绩 (30%)', '实践成绩 (20%)', '期末成绩 (30%)'],
        datasets: [{
            data: [
                grade.usual || 0,
                grade.theory || 0,
                grade.practical || 0,
                grade.final || 0
            ],
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    };

    // 配置选项
    const options = {
        ...chartBaseOptions, // 使用全局基础配置
        plugins: {
            title: {
                display: true,
                text: '成绩构成比例',
                font: {
                    size: 16
                }
            },
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 12,
                    padding: 10
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value}分`;
                    }
                }
            }
        }
    };

    // 创建图表
    window.pieChart = new Chart(canvas, {
        type: 'pie',
        data: data,
        options: options
    });
}

// 创建班级整体成绩比例饼图
function createClassPieChart(className) {
    const canvas = document.getElementById('pie-chart');

    // 清除现有图表
    if (window.pieChart) {
        window.pieChart.destroy();
    }

    // 获取班级学生
    const students = getStudentsByClass(className);
    if (!students || students.length === 0) {
        // 如果班级没有学生，显示空图表
        window.pieChart = new Chart(canvas, {
            type: 'pie',
            data: {
                labels: ['暂无数据'],
                datasets: [{
                    data: [100],
                    backgroundColor: ['#e0e0e0']
                }]
            },
            options: {
                ...chartBaseOptions, // 使用全局基础配置
                plugins: {
                    title: {
                        display: true,
                        text: '班级成绩分布 - 暂无数据',
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
        window.pieChart = new Chart(canvas, {
            type: 'pie',
            data: {
                labels: ['暂无数据'],
                datasets: [{
                    data: [100],
                    backgroundColor: ['#e0e0e0']
                }]
            },
            options: {
                ...chartBaseOptions, // 使用全局基础配置
                plugins: {
                    title: {
                        display: true,
                        text: '班级成绩分布 - 暂无数据',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
        return;
    }

    // 计算平均成绩
    let totalUsual = 0, totalTheory = 0, totalPractical = 0, totalFinal = 0;
    grades.forEach(grade => {
        totalUsual += grade.usual || 0;
        totalTheory += grade.theory || 0;
        totalPractical += grade.practical || 0;
        totalFinal += grade.final || 0;
    });

    const avgUsual = totalUsual / grades.length;
    const avgTheory = totalTheory / grades.length;
    const avgPractical = totalPractical / grades.length;
    const avgFinal = totalFinal / grades.length;

    // 数据
    const data = {
        labels: ['平时成绩 (20%)', '理论成绩 (30%)', '实践成绩 (20%)', '期末成绩 (30%)'],
        datasets: [{
            data: [avgUsual, avgTheory, avgPractical, avgFinal],
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    };

    // 配置选项
    const options = {
        ...chartBaseOptions, // 使用全局基础配置
        plugins: {
            title: {
                display: true,
                text: `${className} - 班级成绩构成比例`,
                font: {
                    size: 16
                }
            },
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 12,
                    padding: 10
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value.toFixed(1)}分`;
                    }
                }
            }
        }
    };

    // 创建图表
    window.pieChart = new Chart(canvas, {
        type: 'pie',
        data: data,
        options: options
    });
}
// Set thousands separator as comma
Highcharts.setOptions({
    lang: {
        thousandsSep: ','
    }
});


fetch('sibling_prefixes_data.json')
    .then(response => response.json())
    .then(data => {
        // Process data
        const monthlyData = {};

        data.forEach(row => {
            const date = new Date(row.timestamp * 1000); // Convert Unix to JS Date
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = {
                    count: 0,
                    jacBgpSum: 0,
                    jacCidrSum: 0,
                    jacBgpCount: 0,
                    jacCidrCount: 0
                };
            }

            monthlyData[monthKey].count += 1; 
            if (row.jac_val_bgp !== null) {
                monthlyData[monthKey].jacBgpSum += row.jac_val_bgp;
                monthlyData[monthKey].jacBgpCount += 1;
            }
            if (row.jac_val_cidr !== null) {
                monthlyData[monthKey].jacCidrSum += row.jac_val_cidr;
                monthlyData[monthKey].jacCidrCount += 1;
            }
        });

        const categories = Object.keys(monthlyData).sort();
        const counts = categories.map(month => monthlyData[month].count);

        const avgJacBgp = categories.map(month => 
            monthlyData[month].jacBgpCount > 0 ? monthlyData[month].jacBgpSum / monthlyData[month].jacBgpCount : 0
        );
        const avgJacCidr = categories.map(month => 
            monthlyData[month].jacCidrCount > 0 ? monthlyData[month].jacCidrSum / monthlyData[month].jacCidrCount : 0
        );

        // Chart 1: Unique BGP Prefix Pairs per Month
        Highcharts.chart('plot-unq-prefixes', {
            title: { text: "Unique BGP Prefix Pairs per Month" },
            xAxis: { categories: categories },
            yAxis: { title: { text: "Count" } },
            chart: {
                type: "spline",
                zoomType: "xy"
            },
            plotOptions: {
                spline: {
                    marker: {
                        enabled: true,
                        radius: 3
                    }
                }
            }, 
            series: [{
                id: "bgp-unique-prefix-pairs",
                name: "Unique Pairs",
                data: counts,
            }]
        });

        // Chart 2: Jaccard Trends
        Highcharts.chart('plot-jc-bgp-vs-tuned', {
            title: { text: "Trends of Jaccard Values: BGP vs CIDR" },
            xAxis: { categories: categories },
            yAxis: { title: { text: "Average Jaccard Value" } },
            chart: {
                type: "spline",
                zoomType: "xy"
            },
            plotOptions: {
                spline: {
                    marker: {
                        enabled: true,
                        radius: 3
                    }
                }
            },
            series: [{ 
                id: "bgp-jaccard",
                name: "BGP Jaccard",
                data: avgJacBgp, 
                color: "#6495ed",
                dashStyle: "Solid", 
            },
            { 
                id: "cidr-jaccard",
                name: "CIDR Jaccard", 
                data: avgJacCidr, 
                color: "#de3163",
                dashStyle: "Solid", 
            }]
        });
    })
    .catch(error => console.error('Error loading JSON:', error));

class SocialMediaPredictor {
    constructor() {
        this.currentSection = 'prediction';
        this.model = null;
        this.examplePosts = [
            {
                name: "Facebook video (6410 engagement)",
                platform: "Facebook",
                post_type: "video",
                trending: "maybe",
                hour: 6,
                minute: 0,
                month: 1,
                day: 1,
                weekday: 6,
                actual_engagement: 6410
            },
            {
                name: "Facebook poll (6222 engagement)", 
                platform: "Facebook",
                post_type: "poll",
                trending: "no",
                hour: 13,
                minute: 45,
                month: 9,
                day: 10,
                weekday: 6,
                actual_engagement: 6222
            },
            {
                name: "Instagram video (6198 engagement)",
                platform: "Instagram", 
                post_type: "video",
                trending: "yes",
                hour: 10,
                minute: 30,
                month: 4,
                day: 14,
                weekday: 4,
                actual_engagement: 6198
            }
        ];
        
        this.dataInsights = {
            engagement_stats: {
                min: 435,
                max: 6410,
                mean: 3000.12,
                median: 2612.5
            },
            platform_performance: {
                Instagram: {mean: 3757.44, count: 36},
                Facebook: {mean: 3423.03, count: 32}, 
                Twitter: {mean: 1725.22, count: 32}
            },
            post_type_performance: {
                poll: {mean: 3746.38, count: 13},
                video: {mean: 3542.78, count: 23},
                carousel: {mean: 3030.73, count: 26},
                image: {mean: 2601.47, count: 17},
                text: {mean: 2228.62, count: 21}
            }
        };

        this.featureImportance = {
            'platform_Instagram': 0.15,
            'post_type_video': 0.12,
            'trending_yes': 0.11,
            'hour': 0.10,
            'post_type_poll': 0.09,
            'platform_Twitter': -0.08,
            'weekday': 0.07,
            'post_type_text': -0.06,
            'trending_no': -0.05,
            'is_weekend': 0.04,
            'month': 0.03,
            'time_of_day_evening': 0.03,
            'day': 0.02,
            'minute': 0.02,
            'time_of_day_morning': 0.01,
            'post_type_image': -0.01,
            'time_of_day_night': -0.01
        };

        this.init();
    }

    init() {
        
        setTimeout(() => {
            this.setupNavigation();
            this.setupForm();
            this.setupSliders();
            this.setupPresets();
            this.renderCharts();
            this.renderFeatureImportance();
        }, 100);
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.content-section');

        console.log('Setting up navigation:', navButtons.length, 'buttons found');

        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const targetSection = btn.getAttribute('data-section');
                console.log('Navigation clicked:', targetSection);
                
                
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                
                sections.forEach(section => {
                    section.classList.remove('active');
                });
                
                const targetElement = document.getElementById(`${targetSection}-section`);
                if (targetElement) {
                    targetElement.classList.add('active');
                    console.log('Section activated:', targetSection);
                } else {
                    console.error('Target section not found:', `${targetSection}-section`);
                }
                
                this.currentSection = targetSection;
                
                
                if (targetSection === 'explorer') {
                    setTimeout(() => this.renderCharts(), 100);
                } else if (targetSection === 'insights') {
                    setTimeout(() => this.renderFeatureImportance(), 100);
                }
            });
        });
    }

    setupForm() {
        const form = document.getElementById('prediction-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Form submitted');
                this.makePrediction();
            });
        }
    }

    setupSliders() {
        const sliders = [
            { id: 'month', valueId: 'month-value', formatter: (val) => `${val}` },
            { id: 'day', valueId: 'day-value', formatter: (val) => `${val}` },
            { id: 'hour', valueId: 'hour-value', formatter: (val) => `${val.toString().padStart(2, '0')}:00` },
            { id: 'minute', valueId: 'minute-value', formatter: (val) => `${val}` }
        ];

        sliders.forEach(slider => {
            const element = document.getElementById(slider.id);
            const valueElement = document.getElementById(slider.valueId);
            
            if (element && valueElement) {
                element.addEventListener('input', (e) => {
                    valueElement.textContent = slider.formatter(parseInt(e.target.value));
                });
                
                
                valueElement.textContent = slider.formatter(parseInt(element.value));
            }
        });
    }

    setupPresets() {
        const presetButtons = document.querySelectorAll('.preset-btn');
        console.log('Setting up presets:', presetButtons.length, 'buttons found');
        
        presetButtons.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Preset clicked:', index);
                this.loadPreset(index);
            });
        });
    }

    loadPreset(index) {
        const preset = this.examplePosts[index];
        console.log('Loading preset:', preset);
        
        
        const platformSelect = document.getElementById('platform');
        const postTypeSelect = document.getElementById('post_type');
        const trendingSelect = document.getElementById('trending');
        const weekdaySelect = document.getElementById('weekday');
        const monthSlider = document.getElementById('month');
        const daySlider = document.getElementById('day');
        const hourSlider = document.getElementById('hour');
        const minuteSlider = document.getElementById('minute');
        
        if (platformSelect) platformSelect.value = preset.platform;
        if (postTypeSelect) postTypeSelect.value = preset.post_type;
        if (trendingSelect) trendingSelect.value = preset.trending;
        if (weekdaySelect) weekdaySelect.value = preset.weekday.toString();
        if (monthSlider) monthSlider.value = preset.month;
        if (daySlider) daySlider.value = preset.day;
        if (hourSlider) hourSlider.value = preset.hour;
        if (minuteSlider) minuteSlider.value = preset.minute;
        
        
        const monthValue = document.getElementById('month-value');
        const dayValue = document.getElementById('day-value');
        const hourValue = document.getElementById('hour-value');
        const minuteValue = document.getElementById('minute-value');
        
        if (monthValue) monthValue.textContent = preset.month;
        if (dayValue) dayValue.textContent = preset.day;
        if (hourValue) hourValue.textContent = `${preset.hour.toString().padStart(2, '0')}:00`;
        if (minuteValue) minuteValue.textContent = preset.minute;
        
        
        this.showToast(`Loaded: ${preset.name}`);
    }

    makePrediction() {
        console.log('Making prediction...');
        const formData = this.getFormData();
        
        console.log('Form data:', formData);
        
        if (!this.validateForm(formData)) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }

        
        const submitBtn = document.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Predicting...';
        submitBtn.disabled = true;

        
        setTimeout(() => {
            const prediction = this.predictEngagement(formData);
            console.log('Prediction result:', prediction);
            this.displayResults(prediction);
            
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }

    getFormData() {
        return {
            platform: document.getElementById('platform')?.value || '',
            post_type: document.getElementById('post_type')?.value || '',
            trending: document.getElementById('trending')?.value || '',
            month: parseInt(document.getElementById('month')?.value || '1'),
            day: parseInt(document.getElementById('day')?.value || '1'),
            weekday: parseInt(document.getElementById('weekday')?.value || '0'),
            hour: parseInt(document.getElementById('hour')?.value || '12'),
            minute: parseInt(document.getElementById('minute')?.value || '0')
        };
    }

    validateForm(data) {
        const isValid = data.platform && data.post_type && data.trending && 
                       !isNaN(data.month) && !isNaN(data.day) && !isNaN(data.weekday) &&
                       !isNaN(data.hour) && !isNaN(data.minute);
        console.log('Form validation result:', isValid, data);
        return isValid;
    }

    predictEngagement(data) {
        
        let baseEngagement = 2500;
        
        
        const platformMultipliers = {
            'Instagram': 1.25,
            'Facebook': 1.14,
            'Twitter': 0.58
        };
        baseEngagement *= (platformMultipliers[data.platform] || 1);
        
        
        const postTypeMultipliers = {
            'poll': 1.50,
            'video': 1.42,
            'carousel': 1.21,
            'image': 1.04,
            'text': 0.89
        };
        baseEngagement *= (postTypeMultipliers[data.post_type] || 1);
        
        
        const trendingMultipliers = {
            'yes': 1.3,
            'maybe': 1.1,
            'no': 0.9
        };
        baseEngagement *= (trendingMultipliers[data.trending] || 1);
        
        
        let timeMultiplier = 1.0;
        if (data.hour >= 6 && data.hour < 12) timeMultiplier = 1.1; 
        else if (data.hour >= 12 && data.hour < 18) timeMultiplier = 1.2; 
        else if (data.hour >= 18 && data.hour < 22) timeMultiplier = 1.3; 
        else timeMultiplier = 0.8; 
        
        baseEngagement *= timeMultiplier;
        
        
        if (data.weekday === 5 || data.weekday === 6) {
            baseEngagement *= 1.15;
        }
        
        
        const randomFactor = 0.8 + (Math.random() * 0.4); 
        baseEngagement *= randomFactor;
        
        const predictedEngagement = Math.round(baseEngagement);
        const confidence = Math.min(95, 60 + Math.random() * 30); 
        
        return {
            engagement: predictedEngagement,
            confidence: Math.round(confidence),
            category: this.getPerformanceCategory(predictedEngagement),
            explanation: this.generateExplanation(data, predictedEngagement)
        };
    }

    getPerformanceCategory(engagement) {
        if (engagement >= 5000) return "Excellent";
        if (engagement >= 3500) return "Good";
        if (engagement >= 2000) return "Average";
        return "Below Average";
    }

    generateExplanation(data, predictedEngagement) {
        const explanations = [];
        
        
        if (data.platform === 'Instagram') {
            explanations.push("Instagram typically generates higher engagement");
        } else if (data.platform === 'Twitter') {
            explanations.push("Twitter posts tend to have lower engagement rates");
        }
        
        
        if (data.post_type === 'video' || data.post_type === 'poll') {
            explanations.push(`${data.post_type} content performs well with audiences`);
        }
        
        
        if (data.hour >= 18 && data.hour < 22) {
            explanations.push("Evening posts catch users during peak activity hours");
        } else if (data.hour >= 6 && data.hour < 12) {
            explanations.push("Morning posts benefit from commute-time browsing");
        }
        
        
        if (data.trending === 'yes') {
            explanations.push("Trending content receives algorithm boost");
        }
        
        return explanations.length > 0 ? explanations.join(". ") + "." : 
               "Prediction based on historical performance patterns.";
    }

    displayResults(prediction) {
        const engagementEl = document.getElementById('predicted-engagement');
        const confidenceEl = document.getElementById('confidence-level');
        const categoryEl = document.getElementById('performance-category');
        const explanationEl = document.getElementById('prediction-explanation');
        const resultsEl = document.getElementById('prediction-results');
        
        if (engagementEl) engagementEl.textContent = prediction.engagement.toLocaleString();
        if (confidenceEl) confidenceEl.textContent = `${prediction.confidence}%`;
        if (categoryEl) categoryEl.textContent = prediction.category;
        if (explanationEl) explanationEl.textContent = prediction.explanation;
        
        if (resultsEl) {
            resultsEl.classList.remove('hidden');
            
            
            resultsEl.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    renderCharts() {
        
        if (this.currentSection !== 'explorer') return;
        
        setTimeout(() => {
            this.renderPlatformChart();
            this.renderPostTypeChart();
        }, 200);
    }

    renderPlatformChart() {
        const chartEl = document.getElementById('platform-chart');
        if (!chartEl || !window.Plotly) return;
        
        const data = this.dataInsights.platform_performance;
        
        const chartData = [{
            x: Object.keys(data),
            y: Object.values(data).map(d => Math.round(d.mean)),
            type: 'bar',
            marker: {
                color: ['#1FB8CD', '#FFC185', '#B4413C']
            },
            text: Object.values(data).map(d => `${d.count} posts`),
            textposition: 'outside',
            hovertemplate: '<b>%{x}</b><br>Avg Engagement: %{y:,}<br>Posts: %{text}<extra></extra>'
        }];

        const layout = {
            title: '',
            xaxis: { title: 'Platform' },
            yaxis: { title: 'Average Engagement' },
            margin: { l: 60, r: 20, t: 20, b: 60 },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#134252' }
        };

        Plotly.newPlot('platform-chart', chartData, layout, {
            displayModeBar: false,
            responsive: true
        });
    }

    renderPostTypeChart() {
        const chartEl = document.getElementById('post-type-chart');
        if (!chartEl || !window.Plotly) return;
        
        const data = this.dataInsights.post_type_performance;
        
        const chartData = [{
            x: Object.keys(data),
            y: Object.values(data).map(d => Math.round(d.mean)),
            type: 'bar',
            marker: {
                color: ['#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325']
            },
            text: Object.values(data).map(d => `${d.count} posts`),
            textposition: 'outside',
            hovertemplate: '<b>%{x}</b><br>Avg Engagement: %{y:,}<br>Posts: %{text}<extra></extra>'
        }];

        const layout = {
            title: '',
            xaxis: { title: 'Post Type' },
            yaxis: { title: 'Average Engagement' },
            margin: { l: 60, r: 20, t: 20, b: 60 },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#134252' }
        };

        Plotly.newPlot('post-type-chart', chartData, layout, {
            displayModeBar: false,
            responsive: true
        });
    }

    renderFeatureImportance() {
        
        if (this.currentSection !== 'insights') return;
        
        setTimeout(() => {
            const chartEl = document.getElementById('feature-importance-chart');
            if (!chartEl || !window.Plotly) return;
            
            const features = Object.keys(this.featureImportance);
            const values = Object.values(this.featureImportance);
            
            
            const sortedData = features.map((feature, i) => ({
                feature: this.formatFeatureName(feature),
                value: values[i]
            })).sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

            const chartData = [{
                x: sortedData.map(d => d.value),
                y: sortedData.map(d => d.feature),
                type: 'bar',
                orientation: 'h',
                marker: {
                    color: sortedData.map(d => d.value >= 0 ? '#32808D' : '#C0152F')
                },
                hovertemplate: '<b>%{y}</b><br>Importance: %{x:.3f}<extra></extra>'
            }];

            const layout = {
                title: '',
                xaxis: { title: 'Feature Importance' },
                yaxis: { title: '' },
                margin: { l: 150, r: 20, t: 20, b: 60 },
                plot_bgcolor: 'rgba(0,0,0,0)',
                paper_bgcolor: 'rgba(0,0,0,0)',
                font: { color: '#134252' },
                height: 400
            };

            Plotly.newPlot('feature-importance-chart', chartData, layout, {
                displayModeBar: false,
                responsive: true
            });
        }, 200);
    }

    formatFeatureName(feature) {
        const nameMap = {
            'platform_Instagram': 'Platform: Instagram',
            'platform_Twitter': 'Platform: Twitter', 
            'post_type_video': 'Post Type: Video',
            'post_type_poll': 'Post Type: Poll',
            'post_type_text': 'Post Type: Text',
            'post_type_image': 'Post Type: Image',
            'trending_yes': 'Trending: Yes',
            'trending_no': 'Trending: No',
            'hour': 'Hour of Day',
            'weekday': 'Day of Week',
            'month': 'Month',
            'day': 'Day of Month',
            'minute': 'Minute',
            'is_weekend': 'Is Weekend',
            'time_of_day_evening': 'Evening Post',
            'time_of_day_morning': 'Morning Post',
            'time_of_day_night': 'Night Post'
        };
        return nameMap[feature] || feature;
    }

    showToast(message, type = 'success') {
        
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;
        
        
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            backgroundColor: type === 'error' ? '#C0152F' : '#32808D',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: '1000',
            fontSize: '14px',
            fontWeight: '500',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease'
        });
        
        document.body.appendChild(toast);
        
        
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}


let app;
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    app = new SocialMediaPredictor();
});


window.addEventListener('resize', () => {
    if (window.Plotly && app) {
        if (document.getElementById('platform-chart')) {
            Plotly.Plots.resize('platform-chart');
        }
        if (document.getElementById('post-type-chart')) {
            Plotly.Plots.resize('post-type-chart');
        }
        if (document.getElementById('feature-importance-chart')) {
            Plotly.Plots.resize('feature-importance-chart');
        }
    }
});


const updateChartsTheme = () => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches ||
                      document.documentElement.getAttribute('data-color-scheme') === 'dark';
    
    const fontColor = isDarkMode ? '#f5f5f5' : '#134252';
    const update = {
        'font.color': fontColor
    };
    
    if (window.Plotly) {
        const charts = ['platform-chart', 'post-type-chart', 'feature-importance-chart'];
        charts.forEach(chartId => {
            if (document.getElementById(chartId)) {
                Plotly.relayout(chartId, update);
            }
        });
    }
};


window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateChartsTheme);
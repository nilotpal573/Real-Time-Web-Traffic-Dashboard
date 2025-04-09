const socket = io();
const visitorList = document.getElementById('visitor-list');
const locations = {};
let totalVisitors = 0;
let activeVisitors = 0;

// Initialize chart
const ctx = document.getElementById('trafficChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Visitors per Country',
            data: [],
            backgroundColor: [
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 99, 132, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(255, 159, 64, 0.7)',
                'rgba(153, 102, 255, 0.7)'
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    }
});

// Handle new visitor data
socket.on('new_visitor', function(data) {
    totalVisitors++;
    activeVisitors++;
    
    // Update stats
    document.getElementById('total-visitors').textContent = totalVisitors;
    document.getElementById('active-visitors').textContent = activeVisitors;
    
    // Create visitor list item
    const newVisitor = document.createElement('li');
    newVisitor.className = 'new-visitor';
    
    newVisitor.innerHTML = `
        <div class="visitor-info">
            <div class="visitor-detail">
                <i class="fas fa-laptop-code"></i>
                <span>${data.ip}</span>
            </div>
            <div class="visitor-detail">
                <span class="badge country-badge">${data.location}</span>
            </div>
            <div class="visitor-detail">
                <span class="badge device-badge">${data.device}</span>
            </div>
            <div class="visitor-detail">
                <i class="fas fa-clock"></i>
                <span class="badge duration-badge">${data.session_duration}s</span>
            </div>
        </div>
    `;
    
    // Add to top of list
    visitorList.insertBefore(newVisitor, visitorList.firstChild);
    
    // Limit list to 50 items
    if (visitorList.children.length > 50) {
        visitorList.removeChild(visitorList.lastChild);
    }
    
    // Update chart data
    locations[data.location] = (locations[data.location] || 0) + 1;
    chart.data.labels = Object.keys(locations);
    chart.data.datasets[0].data = Object.values(locations);
    document.getElementById('unique-countries').textContent = Object.keys(locations).length;
    chart.update();
    
    // Simulate visitor leaving after session duration
    setTimeout(() => {
        activeVisitors--;
        document.getElementById('active-visitors').textContent = activeVisitors;
    }, data.session_duration * 1000);
});
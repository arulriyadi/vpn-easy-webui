<template>
	<div class="container-fluid">
		<div class="row">
			<div class="col-12">
				<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
					<h1 class="h2">
						<i class="bi bi-house me-2"></i>
						Dashboard
					</h1>
					<div class="btn-toolbar mb-2 mb-md-0">
						<div class="btn-group me-2">
							<button type="button" class="btn btn-sm btn-outline-secondary" @click="refreshData">
								<i class="bi bi-arrow-clockwise me-1"></i>
								Refresh
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- System Overview Cards -->
		<div class="row mb-4">
			<div class="col-md-3 mb-3">
				<div class="card bg-primary text-white">
					<div class="card-body">
						<div class="d-flex justify-content-between">
							<div>
								<h6 class="card-title">WireGuard Configs</h6>
								<h3 class="mb-0">{{ activeConfigs }}</h3>
							</div>
							<div class="align-self-center">
								<i class="bi bi-shield-lock fs-1"></i>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-3 mb-3">
				<div class="card bg-success text-white">
					<div class="card-body">
						<div class="d-flex justify-content-between">
							<div>
								<h6 class="card-title">Total Peers</h6>
								<h3 class="mb-0">{{ totalPeers }}</h3>
							</div>
							<div class="align-self-center">
								<i class="bi bi-people fs-1"></i>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-3 mb-3">
				<div class="card bg-info text-white">
					<div class="card-body">
						<div class="d-flex justify-content-between">
							<div>
								<h6 class="card-title">Connected Users</h6>
								<h3 class="mb-0">{{ totalUsers }}</h3>
							</div>
							<div class="align-self-center">
								<i class="bi bi-person-check fs-1"></i>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-3 mb-3">
				<div class="card bg-warning text-white">
					<div class="card-body">
						<div class="d-flex justify-content-between">
							<div>
								<h6 class="card-title">System Status</h6>
								<h3 class="mb-0">{{ systemStatus }}</h3>
							</div>
							<div class="align-self-center">
								<i class="bi bi-cpu fs-1"></i>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>


		<!-- System Status -->
		<div class="row mb-4">
			<div class="col-12">
				<div class="card">
					<div class="card-header">
						<h5 class="card-title mb-0">
							<i class="bi bi-cpu me-2"></i>
							System Status
						</h5>
					</div>
					<div class="card-body">
						<SystemStatus></SystemStatus>
					</div>
				</div>
			</div>
		</div>

		<!-- Recent Activity -->
		<div class="row">
			<div class="col-md-6">
				<div class="card">
					<div class="card-header">
						<h5 class="card-title mb-0">
							<i class="bi bi-clock-history me-2"></i>
							Recent Activity
						</h5>
					</div>
					<div class="card-body">
						<div class="list-group list-group-flush">
							<div v-for="activity in recentActivity" :key="activity.id" 
								 class="list-group-item d-flex justify-content-between align-items-center">
								<div>
									<h6 class="mb-1">{{ activity.action }}</h6>
									<p class="mb-1 text-muted">{{ activity.description }}</p>
									<small class="text-muted">{{ formatTime(activity.timestamp) }}</small>
								</div>
								<span class="badge" :class="getActivityBadgeClass(activity.type)">
									{{ activity.type }}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-6">
				<div class="card">
					<div class="card-header">
						<h5 class="card-title mb-0">
							<i class="bi bi-info-circle me-2"></i>
							System Information
						</h5>
					</div>
					<div class="card-body">
						<div class="row">
							<div class="col-6">
								<strong>WGDashboard Version:</strong><br>
								<small class="text-muted">{{ dashboardVersion }}</small>
							</div>
							<div class="col-6">
								<strong>System Uptime:</strong><br>
								<small class="text-muted">{{ systemUptime }}</small>
							</div>
							<div class="col-6 mt-3">
								<strong>Active Configurations:</strong><br>
								<small class="text-muted">{{ activeConfigs }} / {{ totalConfigs }}</small>
							</div>
							<div class="col-6 mt-3">
								<strong>Connected Peers:</strong><br>
								<small class="text-muted">{{ connectedPeers }}</small>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { DashboardConfigurationStore } from "@/stores/DashboardConfigurationStore.js";
import { WireguardConfigurationsStore } from "@/stores/WireguardConfigurationsStore.js";
import { fetchGet } from "@/utilities/fetch.js";
import SystemStatus from "@/components/systemStatusComponents/systemStatusWidget.vue";

export default {
	name: "dashboardHome",
	components: { SystemStatus },
	setup() {
		const store = DashboardConfigurationStore();
		const wireguardStore = WireguardConfigurationsStore();
		return { store, wireguardStore };
	},
	data() {
		return {
			recentActivity: [],
			stats: {
				totalUsers: 0,
				systemUptime: "Loading...",
				dashboardVersion: "Loading..."
			}
		};
	},
	computed: {
		activeConfigs() {
			return this.wireguardStore.Configurations ? this.wireguardStore.Configurations.filter(c => c.Status).length : 0;
		},
		totalConfigs() {
			return this.wireguardStore.Configurations ? this.wireguardStore.Configurations.length : 0;
		},
		totalPeers() {
			return this.wireguardStore.Configurations ? this.wireguardStore.Configurations.reduce((sum, c) => sum + (c.PeerCount || 0), 0) : 0;
		},
		connectedPeers() {
			// Placeholder - would need actual peer status
			return Math.floor(this.totalPeers * 0.7);
		},
		totalUsers() {
			return this.stats.totalUsers;
		},
		systemStatus() {
			return this.activeConfigs > 0 ? "Active" : "Idle";
		},
		systemUptime() {
			return this.stats.systemUptime;
		},
		dashboardVersion() {
			return this.stats.dashboardVersion;
		}
	},
	async mounted() {
		await this.loadData();
		this.loadRecentActivity();
		this.loadSystemInfo();
	},
	methods: {
		async loadData() {
			try {
				// Load WireGuard configurations
				await this.wireguardStore.getConfigurations();
				
				// Load user statistics (if available)
				// This would need to be implemented based on your user management system
			} catch (error) {
				console.error("Failed to load dashboard data:", error);
			}
		},
		loadRecentActivity() {
			// Mock recent activity data
			this.recentActivity = [
				{
					id: 1,
					action: "System Started",
					description: "WGDashboard has been started successfully",
					type: "success",
					timestamp: new Date(Date.now() - 300000)
				},
				{
					id: 2,
					action: "Configuration Loaded",
					description: "WireGuard configurations loaded",
					type: "info",
					timestamp: new Date(Date.now() - 600000)
				},
				{
					id: 3,
					action: "User Login",
					description: "Admin user logged in",
					type: "success",
					timestamp: new Date(Date.now() - 900000)
				}
			];
		},
		loadSystemInfo() {
			// Mock system information
			this.stats.systemUptime = "2 hours, 15 minutes";
			this.stats.dashboardVersion = "4.2.5";
			this.stats.totalUsers = 3; // This would come from user management
		},
		refreshData() {
			this.loadData();
			this.loadRecentActivity();
			this.loadSystemInfo();
		},
		formatTime(timestamp) {
			return new Date(timestamp).toLocaleString();
		},
		getActivityBadgeClass(type) {
			const classes = {
				success: 'bg-success',
				info: 'bg-info',
				warning: 'bg-warning',
				error: 'bg-danger'
			};
			return classes[type] || 'bg-secondary';
		}
	}
};
</script>

<style scoped>
.card {
	border: none;
	box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-header {
	background-color: var(--bs-gray-100);
	border-bottom: 1px solid var(--bs-gray-200);
}

/* Dark theme support */
[data-bs-theme="dark"] .card-header {
	background-color: var(--bs-gray-800);
	border-bottom-color: var(--bs-gray-700);
}

.list-group-item {
	border-left: none;
	border-right: none;
}

.list-group-item:first-child {
	border-top: none;
}

.list-group-item:last-child {
	border-bottom: none;
}

.btn {
	border-radius: 0.375rem;
}
</style>


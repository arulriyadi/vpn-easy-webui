<script>
import {WireguardConfigurationsStore} from "@/stores/WireguardConfigurationsStore.js";
import {DashboardConfigurationStore} from "@/stores/DashboardConfigurationStore.js";
import {fetchGet} from "@/utilities/fetch.js";
import LocaleText from "@/components/text/localeText.vue";
import {GetLocale} from "@/utilities/locale.js";
import HelpModal from "@/components/navbarComponents/helpModal.vue";
import AgentModal from "@/components/navbarComponents/agentModal.vue";

export default {
	name: "navbar",
	components: {HelpModal, LocaleText, AgentModal},
	setup(){
		const wireguardConfigurationsStore = WireguardConfigurationsStore();
		const dashboardConfigurationStore = DashboardConfigurationStore();
		return {wireguardConfigurationsStore, dashboardConfigurationStore}
	},
		data(){
			return {
				updateAvailable: false,
				updateMessage: "Checking for update...",
				updateUrl: "",
				openHelpModal: false,
				openAgentModal: false,
				showVpnDropdown: false,
				showFirewallDropdown: false,
				showRbacDropdown: false,
			}
		},
	computed: {
		getActiveCrossServer(){
			if (this.dashboardConfigurationStore.ActiveServerConfiguration){
				return new URL(this.dashboardConfigurationStore.CrossServerConfiguration.ServerList
					[this.dashboardConfigurationStore.ActiveServerConfiguration].host)
			}
			return undefined
		}
	},
	mounted() {
		fetchGet("/api/getDashboardUpdate", {}, (res) => {
			if (res.status){
				if (res.data){
					this.updateAvailable = true
					this.updateUrl = res.data
				}
				this.updateMessage = res.message
			}else{
				this.updateMessage = GetLocale("Failed to check available update")
				console.log(`Failed to get update: ${res.message}`)
			}
		})
	},
	methods: {
		toggleVpnDropdown() {
			this.showVpnDropdown = !this.showVpnDropdown;
		},
		toggleFirewallDropdown() {
			this.showFirewallDropdown = !this.showFirewallDropdown;
		},
		toggleRbacDropdown() {
			this.showRbacDropdown = !this.showRbacDropdown;
		}
	}
}
</script>

<template>
	<div class="col-md-3 col-lg-2 d-md-block p-2 navbar-container"
	     :class="{active: this.dashboardConfigurationStore.ShowNavBar}"
	     :data-bs-theme="dashboardConfigurationStore.Configuration?.Server?.dashboard_theme"
	>
		<nav id="sidebarMenu" class=" bg-body-tertiary sidebar border h-100 rounded-3 shadow overflow-y-scroll" >
			<div class="sidebar-sticky ">
				<div class="text-white text-center m-0 py-3 mb-2 btn-brand">
					<h5 class="mb-0">
						WGDashboard
					</h5>
					<small class="ms-auto" v-if="getActiveCrossServer !== undefined">
						<i class="bi bi-hdd-rack-fill me-2"></i>{{getActiveCrossServer.host}}
					</small>
				</div>
				<ul class="nav flex-column px-2 gap-1">
					<li class="nav-item">
						<RouterLink class="nav-link rounded-3"
						            to="/" exact-active-class="active">
							<i class="bi bi-house me-2"></i>
							<LocaleText t="Home"></LocaleText>	
						</RouterLink></li>
					<li class="nav-item">
						<RouterLink class="nav-link rounded-3" to="/settings" 
						            exact-active-class="active">
							<i class="bi bi-gear me-2"></i>
							<LocaleText t="Settings"></LocaleText>	
						</RouterLink>
					</li>
					<li class="nav-item">
						<a class="nav-link rounded-3" role="button" @click="openAgentModal = true">
							<i class="bi bi-question-circle me-2"></i>
							<LocaleText t="Help"></LocaleText>
						</a>
					</li>
				</ul>
				<hr class="text-body my-2">
				<h6 class="sidebar-heading px-3 mt-3 mb-1 text-center" 
				    :class="dashboardConfigurationStore.Configuration?.Server?.dashboard_theme === 'dark' ? 'text-light-emphasis' : 'text-muted'">
					<LocaleText t="VPN Management"></LocaleText>
				</h6>
				<ul class="nav flex-column px-2 gap-1">
					<li class="nav-item">
						<a class="nav-link rounded-3 dropdown-toggle" 
						   @click.prevent="toggleVpnDropdown" 
						   role="button" 
						   :class="{ 'show': showVpnDropdown }">
							<i class="bi bi-shield-lock me-2"></i>
							<LocaleText t="VPN Management"></LocaleText>
						</a>
						<div class="dropdown-menu" 
						     :class="{ 'show': showVpnDropdown }"
						     style="position: static; float: none; width: auto; margin-top: 0; background-color: transparent; border: none; box-shadow: none;">
							<div class="ms-4 mt-1">
								<!-- WireGuard Management -->
								<RouterLink to="/wireguard_configurations" 
											class="nav-link rounded-3"
											active-class="active"
											style="padding: 0.5rem 1rem;">
									<i class="bi bi-shield-lock me-2"></i>
									<LocaleText t="WireGuard Management"></LocaleText>
								</RouterLink>
							</div>
						</div>
					</li>
				</ul>
				<hr class="text-body my-2">
				<h6 class="sidebar-heading px-3 mt-3 mb-1 text-center" 
				    :class="dashboardConfigurationStore.Configuration?.Server?.dashboard_theme === 'dark' ? 'text-light-emphasis' : 'text-muted'">
					<LocaleText t="Firewall Management"></LocaleText>
				</h6>
				<ul class="nav flex-column px-2 gap-1">
					<li class="nav-item">
						<a class="nav-link rounded-3 dropdown-toggle" 
						   @click.prevent="toggleFirewallDropdown" 
						   role="button" 
						   :class="{ 'show': showFirewallDropdown }">
							<i class="bi bi-shield-check me-2"></i>
							<LocaleText t="Firewall Management"></LocaleText>
						</a>
						<div class="dropdown-menu" 
						     :class="{ 'show': showFirewallDropdown }"
						     style="position: static; float: none; width: auto; margin-top: 0; background-color: transparent; border: none; box-shadow: none;">
							<div class="ms-4 mt-1">
								<!-- Firewall Filter -->
								<RouterLink to="/firewall/filter" 
											class="nav-link rounded-3"
											active-class="active"
											style="padding: 0.5rem 1rem;">
									<i class="bi bi-funnel me-2"></i>
									<LocaleText t="Firewall Filter"></LocaleText>
								</RouterLink>
								<!-- Firewall NAT -->
								<RouterLink to="/firewall/nat" 
											class="nav-link rounded-3"
											active-class="active"
											style="padding: 0.5rem 1rem;">
									<i class="bi bi-arrow-left-right me-2"></i>
									<LocaleText t="Firewall NAT"></LocaleText>
								</RouterLink>
							</div>
						</div>
					</li>
					<!-- RBAC Management -->
					<li class="nav-item">
						<a class="nav-link rounded-3 dropdown-toggle" 
						   @click.prevent="toggleRbacDropdown" 
						   role="button" 
						   :class="{ 'show': showRbacDropdown }">
							<i class="bi bi-people-fill me-2"></i>
							<LocaleText t="RBAC Management"></LocaleText>
						</a>
						<div class="dropdown-menu" 
						     :class="{ 'show': showRbacDropdown }"
						     style="position: static; float: none; width: auto; margin-top: 0; background-color: transparent; border: none; box-shadow: none;">
							<div class="ms-4 mt-1">
								<!-- Enhanced RBAC -->
								<RouterLink to="/enhanced-rbac" 
											class="nav-link rounded-3"
											active-class="active"
											style="padding: 0.5rem 1rem;">
									<i class="bi bi-shield-check me-2"></i>
									<LocaleText t="Enhanced RBAC"></LocaleText>
								</RouterLink>
								<!-- Organization Management -->
								<RouterLink to="/organizations" 
											class="nav-link rounded-3"
											active-class="active"
											style="padding: 0.5rem 1rem;">
									<i class="bi bi-building me-2"></i>
									<LocaleText t="Organization Management"></LocaleText>
								</RouterLink>
								<!-- Policy Management -->
								<RouterLink to="/rbac/policies" 
											class="nav-link rounded-3"
											active-class="active"
											style="padding: 0.5rem 1rem;">
									<i class="bi bi-shield-shaded me-2"></i>
									<LocaleText t="Policy Management"></LocaleText>
								</RouterLink>
								<!-- User Management -->
								<RouterLink to="/user_management" 
											class="nav-link rounded-3"
											active-class="active"
											style="padding: 0.5rem 1rem;">
									<i class="bi bi-people me-2"></i>
									<LocaleText t="User Management"></LocaleText>
								</RouterLink>
							</div>
						</div>
					</li>
				</ul>
				<hr class="text-body my-2">
				<h6 class="sidebar-heading px-3 mt-3 mb-1 text-center" 
				    :class="dashboardConfigurationStore.Configuration?.Server?.dashboard_theme === 'dark' ? 'text-light-emphasis' : 'text-muted'">
					<LocaleText t="Tools"></LocaleText>
				</h6>
				<ul class="nav flex-column px-2 gap-1">
					<li class="nav-item">
						<RouterLink to="/system_status" class="nav-link rounded-3" active-class="active">
							<i class="bi bi-cpu me-2"></i>
							<LocaleText t="System Status"></LocaleText>
						</RouterLink>
					</li>
					<li class="nav-item">
						<RouterLink to="/routing" class="nav-link rounded-3" active-class="active">
							<i class="bi bi-diagram-3 me-2"></i>
							<LocaleText t="Routing Management"></LocaleText>
						</RouterLink>
					</li>
					<li class="nav-item">
						<RouterLink to="/logging" class="nav-link rounded-3" active-class="active">
							<i class="bi bi-journal-text me-2"></i>
							<LocaleText t="Logging Management"></LocaleText>
						</RouterLink>
					</li>
					<li class="nav-item">
						<RouterLink to="/ping" class="nav-link rounded-3" active-class="active">
							<i class="bi bi-broadcast me-2"></i>
							<LocaleText t="Ping"></LocaleText>
						</RouterLink></li>
					<li class="nav-item">
						<RouterLink to="/traceroute" class="nav-link rounded-3" active-class="active">
							<i class="bi bi-diagram-2 me-2"></i>
							<LocaleText t="Traceroute"></LocaleText>
						</RouterLink>
					</li>
				</ul>
				<hr class="text-body my-2">
				<ul class="nav flex-column px-2 mb-3">
					<li class="nav-item">
						<a class="nav-link text-danger rounded-3" 
					                        @click="this.dashboardConfigurationStore.signOut()" 
					                        role="button" style="font-weight: bold">
							<i class="bi bi-box-arrow-left me-2"></i>
							<LocaleText t="Sign Out"></LocaleText>	
						</a>
					</li>
					<li class="nav-item" style="font-size: 0.8rem">
						<a :href="this.updateUrl" v-if="this.updateAvailable" class="text-decoration-none rounded-3" target="_blank">
							<small class="nav-link text-muted rounded-3" >
								<LocaleText :t="this.updateMessage"></LocaleText>
								(<LocaleText t="Current Version:"></LocaleText> {{ dashboardConfigurationStore.Configuration?.Server?.version }})
							</small>
						</a>
						<small class="nav-link text-muted rounded-3" v-else>
							<LocaleText :t="this.updateMessage"></LocaleText>
							({{ dashboardConfigurationStore.Configuration?.Server?.version }})
						</small>
					</li>
				</ul>
			</div>
		</nav>
		<Transition name="zoom">
			<HelpModal v-if="this.openHelpModal" @close="openHelpModal = false;"></HelpModal>
		</Transition>
		<Transition name="slideIn">
			<AgentModal v-if="this.openAgentModal" @close="openAgentModal = false"></AgentModal>
		</Transition>
	</div>
</template>

<style scoped>
@media screen and (max-width: 768px) {
	.navbar-container{
		position: absolute !important;
		z-index: 1000;
		animation-duration: 0.4s;
		animation-fill-mode: both;
		display: none;
		animation-timing-function: cubic-bezier(0.82, 0.58, 0.17, 0.9);
	}
	
	.navbar-container.active{
		animation-direction: normal;
		display: block !important;
		animation-name: zoomInFade
	}
}

.navbar-container{
	height: 100vh;
	position: relative;
}

/* Theme-specific styling for sidebar text - More specific selectors */
.navbar-container[data-bs-theme="dark"] .sidebar .nav-link {
	color: white !important;
}

.navbar-container[data-bs-theme="dark"] .sidebar .nav-link:hover {
	color: #ffffff !important;
	background-color: #323844 !important;
}

.navbar-container[data-bs-theme="dark"] .sidebar .nav-link.active {
	color: #74b7ff !important;
	background-color: #323844 !important;
}

.navbar-container[data-bs-theme="dark"] .sidebar .nav-link i {
	color: white !important;
}

.navbar-container[data-bs-theme="light"] .sidebar .nav-link {
	color: #333333 !important;
}

.navbar-container[data-bs-theme="light"] .sidebar .nav-link:hover {
	color: #000000 !important;
	background-color: #e8e8e8 !important;
}

.navbar-container[data-bs-theme="light"] .sidebar .nav-link.active {
	color: #007bff !important;
	background-color: #e8e8e8 !important;
}

.navbar-container[data-bs-theme="light"] .sidebar .nav-link i {
	color: inherit !important;
}

/* Sidebar headings theme styling - More specific */
.navbar-container[data-bs-theme="dark"] .sidebar-heading {
	color: white !important;
}

.navbar-container[data-bs-theme="light"] .sidebar-heading {
	color: #6c757d !important;
}

/* Force text color for all nav items in dark mode */
.navbar-container[data-bs-theme="dark"] .nav-link {
	color: #e9ecef !important;
}

.navbar-container[data-bs-theme="dark"] .nav-link * {
	color: inherit !important;
}

/* Force text color for all nav items in light mode */
.navbar-container[data-bs-theme="light"] .nav-link {
	color: #333333 !important;
}

.navbar-container[data-bs-theme="light"] .nav-link * {
	color: inherit !important;
}

@supports (height: 100dvh) {
	@media screen and (max-width: 768px){
		.navbar-container{
			height: calc(100dvh - 58px);
		}	
	}
}

@keyframes zoomInFade {
	0%{
		opacity: 0;
		transform: translateY(60px);
		filter: blur(3px);
	}
	100%{
		opacity: 1;
		transform: translateY(0px);
		filter: blur(0px);
	}
}

.slideIn-enter-active,
.slideIn-leave-active{
	transition: all 0.3s cubic-bezier(0.82, 0.58, 0.17, 1);
}

.slideIn-enter-from,
.slideIn-leave-to {
	transform: translateY(30px);
	filter: blur(3px);
	opacity: 0;
}

/* Dropdown styling */
.dropdown-toggle {
	cursor: pointer;
	transition: all 0.2s ease;
}

/* Ensure only one chevron is shown - hide Bootstrap default */
.dropdown-toggle::after {
	display: none !important;
}

/* Hide any manual chevron icons */
.dropdown-toggle .bi-chevron-down,
.dropdown-toggle .bi-chevron-up {
	display: none !important;
}

.dropdown-toggle:hover {
	background-color: rgba(255, 255, 255, 0.1) !important;
}

.dropdown-menu {
	transition: all 0.3s ease;
	max-height: 0;
	overflow: hidden;
	opacity: 0;
}

.dropdown-menu.show {
	max-height: 500px;
	opacity: 1;
}

/* Dark theme dropdown styling */
.navbar-container[data-bs-theme="dark"] .dropdown-toggle:hover {
	background-color: rgba(255, 255, 255, 0.1) !important;
}

.navbar-container[data-bs-theme="light"] .dropdown-toggle:hover {
	background-color: rgba(0, 0, 0, 0.1) !important;
}


/* Submenu header styling */
.nav-submenu-header {
	border-left: 2px solid var(--bs-gray-400);
	padding-left: 0.5rem;
}

.nav-submenu-header small {
	font-size: 0.75rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

/* Dark theme submenu header */
.navbar-container[data-bs-theme="dark"] .nav-submenu-header {
	border-left-color: var(--bs-gray-600);
}

.navbar-container[data-bs-theme="dark"] .nav-submenu-header small {
	color: var(--bs-gray-400) !important;
}
</style>
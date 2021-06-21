'use strict'
import { registerSettingTab } from '../../routes'
import SettingsTouchProbePanel from "./SettingsTouchProbePanel.vue"
import TouchProbePanel from "./TouchProbePanel.vue"

registerSettingTab(false, 'SettingsTouchProbePanel', SettingsTouchProbePanel, 'Probe Settings');
registerSettingTab(false, 'TouchProbePanel', TouchProbePanel, 'Touch Probe');




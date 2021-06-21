<template>
  <v-card>
    <v-card-title>
      <span>Touch Probe</span>
      <v-spacer></v-spacer>
      <a v-show="!uiFrozen" href="#" @click.prevent="showResetConfirmation = true">
        <v-icon small class="mr-1">restore</v-icon>Revert settings</a>
    </v-card-title>
    <v-container fluid grid-list-lg class="px-3">
      <v-switch
        label="Enable"
        v-model="probeEnable"
        :disabled="uiFrozen"
        hide-details
        class="pt-0 mt-0"
      ></v-switch>
       <v-flex xs12 sm12 md12 class="mt-3 pt-3">
          <v-select
            :disabled="!probeEnable"
            label="Type"
            class="ma-0 pa-0"
            v-model="probeType"
            :items=" touchProbeTypeItems"
          ></v-select>
        </v-flex>
      <v-layout row wrap align-center class="mt-0">
        <v-flex xs6 sm6 md6 class="mt-3">
        <v-text-field
          :disabled="!probeEnable"
          v-model.number="probenumber"
          type="number"
          step="1"
          min="0"
          max="9"
          label="Probe Number"
        ></v-text-field>
        </v-flex>
      </v-layout>
      <v-flex xs12 sm12 md12 class="mt-0 pt-0">
        <v-text-field
          :disabled="!probeEnable"
          v-model.number="feedrate"
          type="number"
          step="1"
          min="0"
          label="Feed Rate"
        ></v-text-field>
      </v-flex>
      <v-layout row wrap align-center class="mt-3 pt-2">
        <v-flex xs4 sm4 md4>
          <v-text-field
            :disabled="!probeEnable"
            v-model.number="XDimension"
            type="number"
            step="any"
            min="0.001"
            label="X Dimension (mm)"
          ></v-text-field>
        </v-flex>
        <v-flex xs4 sm4 md4>
          <v-text-field
            :disabled="!probeEnable"
            v-model.number="YDimension"
            type="number"
            step="any"
            min="0.001"
            label="Y Dimension (mm)"
          ></v-text-field>
        </v-flex>
        <v-flex xs4 sm4 md4>
          <v-text-field
            :disabled="!probeEnable"
            v-model.number="ZDimension"
            type="number"
            step="any"
            min="0.001"
            label="Z Dimension (mm)"
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap align-center>
        <v-flex xs4 sm4 md4>
          <v-text-field
            :disabled="!probeEnable"
            v-model.number="XOffset"
            type="number"
            step="any"
            min="0.001"
            label="X Offset"
          ></v-text-field>
        </v-flex>
        <v-flex xs4 sm4 md4>
          <v-text-field
            :disabled="!probeEnable"
            v-model.number="YOffset"
            type="number"
            step="any"
            min="0.001"
            label="Y Offset"
          ></v-text-field>
        </v-flex>
        <v-flex xs4 sm4 md4>
          <v-text-field
            :disabled="!probeEnable"
            v-model.number="ZOffset"
            type="number"
            step="any"
            min="0.001"
            label="Z Offset"
          ></v-text-field>
        </v-flex>
      </v-layout>
    </v-container>
    <confirm-dialog
      :shown.sync="showResetConfirmation"
      question='Confirm'
      prompt='Confirm'
      title='Confirm'
      @confirmed="resetTouchProbe()"
    ></confirm-dialog>
  </v-card>
</template>

<script>
"use strict";

import { mapState, mapMutations, mapGetters } from "vuex";
import { setPluginData, PluginDataType, registerPluginData } from '../../store'

export default {
  name: 'SettingsTouchProbePanel',
    beforeCreate() {
        if(typeof(this.pluginCache) === 'undefined' || typeof(this.pluginCache.touchProbeEnable) === 'undefined' || this.pluginCache.touchProbeEnable === null)
        {
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeEnable', false); 
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeType', false);
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeNumber', 0);
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeTypeText',"XYZ");
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'triggerItems', 1);
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'endstopItems', 3);
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbetriggertype', 0);
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeFeedrate', 500);
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeXDimension', 60);
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeYDimension', 60);
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeZDimension', 10);
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeXOffset', 10);
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeYOffset', 10);
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeZOffset', 5);
    }},
  computed: {
    ...mapState("machine", ["settings"]),
    ...mapState("machine/model", ["electronics"]),
    ...mapState(["isLocal"]),
    ...mapGetters(["uiFrozen"]),
    ...mapState('machine/cache', {pluginCache: state => state.plugins.SettingsTouchProbe}),
		probeEnable: {
			get() {
        return this.pluginCache.touchProbeEnable; 
        },
			set(value) { this.setPluginDataField('touchProbeEnable', value); }
		},
    touchProbeTypeItems() {
      return [
        { text: "XYZ", value: false },
        { text: "Z", value: true }
      ];
    },
    probeType: {
      get() {
try {  return this.pluginCache.touchProbeType;
} catch (error) 
{
    return false;
      }
      },
      set(value) {this.setPluginDataField('touchProbeType', value);
      this.setPluginDataField('touchProbeTypeText', this.touchProbeTypeItems[value].text); 
      }
    },
    endstopDriveNumber: {
      get() {
        return this.pluginCache.touchProbeEndstopDriveNumber;
      },
			set(value) 
      { 
        this.setPluginDataField('touchProbeEndstopDriveNumber', value);
        this.setPluginDataField('touchProbeEndstopAxis', this.endstopItems[value].text); 
      }
    },
    triggerItems() {
      return [
        { text: "Active Low", value: 0 },
        { text: "Active High", value: 1 }
      ];
    },
    endstopItems() {
      return [
        { text: "X", value: 0 },
        { text: "Y", value: 1 },
        { text: "Z", value: 2 },
        { text: "E0", value: 3 },
        { text: "E1", value: 4 }
      ];
    },
    triggerType: {
      get() {
        return this.pluginCache.touchProbeTriggerType;
      },
      set(value) {this.setPluginDataField('touchProbeTriggerType', value);}
    },
    probenumber: {
      get() {
        return this.pluginCache.touchProbeNumber;
      },
      set(value) {this.setPluginDataField('touchProbeNumber', value);}
    },
    feedrate: {
      get() {
        return this.pluginCache.touchProbeFeedrate;
      },
      set(value) {this.setPluginDataField('touchProbeFeedrate', value);}
    },
    XDimension: {
      get() {
        return this.pluginCache.touchProbeXDimension;
      },
      set(value) {this.setPluginDataField('touchProbeXDimension', value);}
    },
    YDimension: {
      get() {
        return this.pluginCache.touchProbeYDimension;
      },
      set(value) {this.setPluginDataField('touchProbeYDimension', value);}
    },
    ZDimension: {
      get() {
        return this.pluginCache.touchProbeZDimension;
      },
        set(value) {this.setPluginDataField('touchProbeZDimension', value);
        if (this.settings.touchProbeType == true) {
          this.setPluginDataField('touchProbeZOffset', value);
          this.update({ touchProbe: { touchProbeZOffset: value } });
        }
      }
    },
    XOffset: {
      get() {
        return this.pluginCache.touchProbeXOffset;
      },
      set(value) {this.setPluginDataField('touchProbeXOffset', value);}
    },
    YOffset: {
      get() {
        return this.pluginCache.touchProbeYOffset;
      },
      set(value) {this.setPluginDataField('touchProbeYOffset', value);}
    },
    ZOffset: {
      get() {
        return this.pluginCache.touchProbeZOffset;
      },
      set(value) {this.setPluginDataField('touchProbeZOffset', value);}
    }
  },
  data() {
    return {
      showResetConfirmation: false,
      driveAxisMap: ["X", "Y", "Z", "E0", "E1"]
    };
  },
  methods: {
    ...mapMutations("machine/settings", ["update"]),
    ...mapMutations("machine/settings", ["resetTouchProbe"]),
    ...mapMutations("machine", ["setTouchProbeEnable"]),
    ...mapMutations("machine/cache", ["SettingsTouchProbe"]),


    
setPluginDataField: function (key, value) 
    {
       setPluginData('SettingsTouchProbe', PluginDataType.machineCache, key, value);
       return true;
    }
  }





};
</script>

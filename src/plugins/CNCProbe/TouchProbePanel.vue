<template>
  <div>
    <v-card>
      <v-card-title class="pb-0 mb-0">
        <v-layout row justify-space-between>
          <v-flex lg8 md8 sm7 xs7>
            <v-icon small class="mr-1"></v-icon>Touch Probe
          </v-flex>
          <v-flex lg4 md4 sm5 xs5>
            <v-select
              :disabled="state.isPrinting || uiFrozen"
              title="Probe Location"
              class="ma-0 pa-0"
              v-model="locationSelect"
              :items="locationItems"
            ></v-select>
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-card-text class="pt-2 pb-2 mt-0">
        <v-layout row wrap justify-space-between>
          <v-flex
            xs12
            sm12
            md3
            lg3
            xl3
            order-xl0
            order-lg0
            order-md0
            order-sm0
            order-xs0
            class="pt-2"
          >
            <v-text-field
              :disabled="uiFrozen || state.isPrinting"
              v-model.number="endmillDiameter"
              type="number"
              step="0.01"
              min="0.01"
              label="Endmill Diameter (mm)"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md9 lg9 xl9 :class="{'pl-5': $vuetify.breakpoint.mdAndUp}">
            <v-layout column>
              <v-layout row wrap>
                <v-flex xs12 sm12 md6 lg6 xl6 justify-center>
                </v-flex>
                <v-flex xs12 sm12 md6 lg6 xl6 justify-center hidden-sm-and-down>
                <br>
                  <div class="text-xs-center text-sm-center text-md-center text-lg-center text-xl-center">
                    <v-icon small class="mr-1">mdi-axis-arrow</v-icon>Probe Individual Axis
                  </div>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs12 sm12 md6 lg6 xl6 :class="{'pr-5': $vuetify.breakpoint.mdAndUp, 'pt-0': $vuetify.breakpoint.smAndDown, }">
                  <v-btn
                    :disabled="uiFrozen || state.isPrinting"
                    title="Probe Corner"
                    color="success"
                    block
                    @click.native="cornerProbeClick"
                  >Probe Corner</v-btn>
                </v-flex>
                 <v-flex xs12 sm12 md6 lg6 xl6 justify-center hidden-md-and-up class="pt-3">
                  <div
                    class="text-xs-center text-sm-center text-md-center text-lg-center text-xl-center"
                  >
                    <v-icon small class="mr-1">mdi-axis-arrow</v-icon>X
                    </div>
                </v-flex>
                <v-flex xs4 sm4 md2 lg2 xl2 >
                  <v-btn
                    :disabled="uiFrozen || state.isPrinting"
                    title="Probe X Axis"
                    color="success"
                    block
                    @click.native="xProbeClick"
                    
                  >
                    <v-icon class="mr-1">mdi-arrow-right</v-icon>X
                  </v-btn>
                </v-flex>
                <v-flex xs4 sm4 md2 lg2 xl2 >
                  <v-btn
                    :disabled="uiFrozen || state.isPrinting"
                    title="Probe Y Axis"
                    color="success"
                    block
                    @click.native="yProbeClick"
                  >
                    <v-icon class="mr-1">mdi-arrow-up</v-icon>
                    Y
                  </v-btn>
                </v-flex>
                <v-flex xs4 sm4 md2 lg2 xl2 >
                  <v-btn
                    :disabled="uiFrozen || state.isPrinting"
                    title="Probe Z Axis"
                    color="success"
                    block
                    @click.native="zProbeClick"
                  >
                    <v-icon class="mr-1">mdi-arrow-down</v-icon>
                    Z
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>



<v-card>
      <v-card-title class="pb-0 mb-0" style="margin: 20px,10px;">
        <v-layout row justify-space-between>
        <table width=100% style="margin: 20px,10px;">
        <tr>
        <td width=20px></td>
        <td>Touch Probe Type {{this.pluginCache.touchProbeTypeText}}</td>
        <td>Feedrate {{this.pluginCache.touchProbeFeedrate}}</td>
        </tr>
        <tr>
        <td></td>
        <td>Touch Probe Number {{this.pluginCache.touchProbeNumber}}</td>
        <td>Dimensions (X/Y/Z) {{this.pluginCache.touchProbeXDimension}}/{{this.pluginCache.touchProbeYDimension}}/{{this.pluginCache.touchProbeZDimension}}</td>
        </tr>
        <tr>
        <td></td>
        <td></td>
        <td>Hole Offset (X/Y/Z) {{this.pluginCache.touchProbeXOffset}}/{{this.pluginCache.touchProbeYOffset}}/{{this.pluginCache.touchProbeZOffset}}</td>
        </tr>
        <tr>
        <td></td>
        </tr>
        <tr height=20px>
        <td></td>
        </tr>
</table>       
<br> 
<br> 
</v-layout>
</v-card-title>
</v-card>
			<thead>
				<tr>
					<th class="text-left" style="width:100px">
						Probe type
					</th>
					<th class="text-left" style="width:100px">
						Value
					</th>
					<th class="text-left" style="width:100px">
						Last Stop height (mm)
					</th>
					<th class="text-left" style="width:100px">
						Dive height (mm)
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(probe, index) in probeItems" :key="index" >
					<td>{{ probe.type }}</td>
					<td>{{ probe.value }}</td>
					<td>{{ probe.lastStopHeight }}</td>
					<td>{{ probe.diveHeight }}</td>
				</tr>
			</tbody>
<br> 
<br> 


    <confirm-dialog
      :shown.sync="showTouchProbeConfirm"
      question="Run Touch Probe Sequence"
      title="Run Touch Probe Sequence"
      :prompt= dialogPrompt
      @confirmed="runProbeCode"
    ></confirm-dialog>
  </div>
</template>

<script>
"use strict";

import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { setPluginData, PluginDataType ,registerPluginData} from '../../store'

export default {
      beforeCreate() {
        if(typeof(this.pluginCache) === 'undefined' || typeof(this.pluginCache.touchProbeEnable) === 'undefined' || this.pluginCache.touchProbeEnable === null)
        {
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeEnable', false); 
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeType', false);
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeNumber', 0);
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'triggerItems', 1);
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeTypeText',"XYZ");
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeFeedrate', 500);
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeXDimension', 60);
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeYDimension', 60);
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeZDimension', 10);
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeXOffset', 10);
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeYOffset', 10);
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeZOffset', 5);
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeTriggerType',0);
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeEndstopDriveNumber',0);
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeEndstopAxis',"X");
    }
       if(typeof(this.pluginCache) === 'undefined' || typeof(this.pluginCache.touchProbeLocation) === 'undefined' || this.pluginCache.touchProbeLocation === null)
        {
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeLocation', "FL"); 
        registerPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeEndmillDiameter', "3");
    }},
  computed: {
    ...mapState("machine", ["settings"]),
    ...mapState("machine/model", ["job", "state"]),
    ...mapGetters(["uiFrozen"]),
    ...mapState('machine/model', {
     axes: state => state.move.axes,
    probes: state => state.sensors.probes
    }),
    probeItems() {
     return this.probes;//.map((type, value) => ({ }), this);
    },
    ...mapState('machine/cache', {pluginCache: state => state.plugins.SettingsTouchProbe}),
    locationItems() {
      return [
        {
          text: "Front Left",
          value: 'FL'
        },
        {
          text: "Front Right",
          value: 'FR'
        },
        {
          text: "Back Left",
          value: 'BL'
        },
        {
          text: "Back Right",
          value: 'BR'
        }
      ];
    },
    locationSelect: {
      get() {
        return this.pluginCache.touchProbeLocation;
      },
      set(value) { setPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeLocation', value); }
    },
    endmillDiameter: {
      get() {
        return this.pluginCache.touchProbeEndmillDiameter;
      },
      set(value) { setPluginData('SettingsTouchProbe', PluginDataType.machineCache, 'touchProbeEndmillDiameter', value); }
    },
    XYZProbe() {
      if (this.pluginCache.touchProbeType == 0){
        return true
      }else{
        return false
      }
    }

  },
  data() {
    return {
      showTouchProbeConfirm: false,
      dialogPrompt: '',
      probeSequence: null,
      xDirection: 1,
      yDirection: 1,
      xProbeDirection: 0,
      yProbeDirection: 0,
      probeCode: null,
      xOffset: 0,
      yOffset: 0,
      xDimension: 0,
      yDimension:0,
    };
  },
  methods: {
    ...mapMutations("machine/settings", ["update"]),
    ...mapActions('machine', ["sendCode"]),
    ...mapActions('machine', ['upload']),
    xProbeClick() {
      this.setCornerDirection();
      this.probeSequence = 'x';
      this.probeCode = `M400\nG91\nM563 P49 S"XYZ-Probe"
      \nG1 Z5 F${this.pluginCache.touchProbeFeedrate}\nG1 X${(((this.xDimension/2)-this.xOffset)*this.xDirection)} Y${(((this.yDimension/2)-this.yOffset)*this.yDirection)} F${this.pluginCache.touchProbeFeedrate}\nG1 X${(((this.xDimension/2)+5+(this.pluginCache.touchProbeEndmillDiameter/2))*this.xDirection*(-1))} F${this.pluginCache.touchProbeFeedrate}\nG1 Z${(-5-(this.pluginCache.touchProbeZDimension/2))} F${this.pluginCache.touchProbeFeedrate}\nT49\nM585 X10 P${this.pluginCache.touchProbeNumber} F${this.pluginCache.touchProbeFeedrate} S${this.xProbeDirection}\nT-1\nM400\nG10 L20 X${((this.xOffset)+(this.pluginCache.touchProbeEndmillDiameter/2))*(-1)*this.xDirection}\nG1 X${-5*this.xDirection} F${this.pluginCache.touchProbeFeedrate}\nM400\nM500\nG1 Z${5+(this.pluginCache.touchProbeZDimension/2)} F${this.pluginCache.touchProbeFeedrate}\nG1 Y${(((this.yDimension/2)-this.yOffset)*this.yDirection*(-1))} F${this.pluginCache.touchProbeFeedrate}\nG90\nG1 X0 F${this.pluginCache.touchProbeFeedrate}
      \nM563 P49 D-1 H-1\nM291 P"Probe complete. Please remove probe." R"Success" S1`
      this.dialogPrompt = "Ensure the endmill is above the Start Here hole with the Touch Probe clip attached.";
      this.showTouchProbeConfirm = true;
    },
    yProbeClick() {
      this.setCornerDirection();
      this.probeSequence = 'y';
      this.probeCode = `M400\nG91\nM563 P49 S"XYZ-Probe"
      \nG1 Z5 F${this.pluginCache.touchProbeFeedrate}\nG1 X${(((this.xDimension/2)-this.xOffset)*this.xDirection)} Y${(((this.yDimension/2)-this.yOffset)*this.yDirection)} F${this.pluginCache.touchProbeFeedrate}\nG1 Y${(((this.yDimension/2)+5+(this.pluginCache.touchProbeEndmillDiameter/2))*this.yDirection*(-1))} F${this.pluginCache.touchProbeFeedrate}\nG1 Z${(-5-(this.pluginCache.touchProbeZDimension/2))} F${this.pluginCache.touchProbeFeedrate}\nT49\nM585 Y10 P${this.pluginCache.touchProbeNumber} F${this.pluginCache.touchProbeFeedrate} S${this.yProbeDirection}\nT-1\nM400\nG10 L20 Y${((this.yOffset)+(this.pluginCache.touchProbeEndmillDiameter/2))*(-1)*this.yDirection}\nG1 Y${-5*this.yDirection} F${this.pluginCache.touchProbeFeedrate}\nM400\nM500\nG1 Z${5+(this.pluginCache.touchProbeZDimension/2)} F${this.pluginCache.touchProbeFeedrate}\nG1 X${(((this.xDimension/2)-this.xOffset)*this.xDirection*(-1))} F${this.pluginCache.touchProbeFeedrate}\nG90\nG1 Y0 F${this.pluginCache.touchProbeFeedrate}
      \nM563 P49 D-1 H-1\nM291 P"Probe complete. Please remove probe." R"Success" S1`
      this.dialogPrompt = "Ensure the endmill is above the Start Here hole with the Touch Probe clip attached.";
      this.showTouchProbeConfirm = true;
    },
    zProbeClick() {
      this.setCornerDirection();
      this.probeSequence = 'z';
      this.probeCode = `M400\nG91\nM563 P49 S"XYZ-Probe"
      \nT49\nM585 Z${(this.pluginCache.touchProbeZDimension-this.pluginCache.touchProbeZOffset)+10} P${this.pluginCache.touchProbeNumber} F${this.pluginCache.touchProbeFeedrate} S1\nT-1\nG10 L20 Z${this.pluginCache.touchProbeZOffset}\nG1 Z5 F${this.pluginCache.touchProbeFeedrate}\nM500\nG90
      \nM563 P49 D-1 H-1\nM291 P"Probe complete. Please remove probe.}" R"Success" S1`
      this.dialogPrompt = "Ensure the endmill is anywhere above the thinnest section of the Touch Probe, with the Touch Probe clip attached.";
      this.showTouchProbeConfirm = true;
    },
    cornerProbeClick() {
      this.setCornerDirection();
      this.probeSequence = 'corner';
      this.probeCode = `M400\nG91\nM563 P49 S"XYZ-Probe"
      \nG1 Z5 F${this.pluginCache.touchProbeFeedrate}\nG1 X${(((this.xDimension/2)-this.xOffset)*this.xDirection)} Y${(((this.yDimension/2)-this.yOffset)*this.yDirection)} F${this.pluginCache.touchProbeFeedrate}\nT49\nM585 Z10 P${this.pluginCache.touchProbeNumber} F${this.pluginCache.touchProbeFeedrate} S1\nT-1\nM400\nG10 L20 Z${this.pluginCache.touchProbeZOffset}\nG1 Z5 F${this.pluginCache.touchProbeFeedrate}
      \nG1 X${(((this.xDimension/2)+5+(this.pluginCache.touchProbeEndmillDiameter/2))*this.xDirection*(-1))} F${this.pluginCache.touchProbeFeedrate}\nG1 Z${(-5-(this.pluginCache.touchProbeZDimension/2))} F${this.pluginCache.touchProbeFeedrate}\nT49\nM585 X10 P${this.pluginCache.touchProbeNumber} F${this.pluginCache.touchProbeFeedrate} S${this.xProbeDirection}\nT-1\nM400\nG10 L20 X${((this.xOffset)+(this.pluginCache.touchProbeEndmillDiameter/2))*(-1)*this.xDirection}\nG1 X${-5*this.xDirection} F${this.pluginCache.touchProbeFeedrate}\nG1 Z${5+(this.pluginCache.touchProbeZDimension/2)} F${this.pluginCache.touchProbeFeedrate}\nG1 X${(5+(this.xDimension/2))*this.xDirection} Y${(((this.yDimension/2)+5+(this.pluginCache.touchProbeEndmillDiameter/2))*this.yDirection*(-1))} F${this.pluginCache.touchProbeFeedrate}
      \nG1 Z${(-5-(this.pluginCache.touchProbeZDimension/2))} F${this.pluginCache.touchProbeFeedrate}\nT49
      \nM585 Y10 P${this.pluginCache.touchProbeNumber} F${this.pluginCache.touchProbeFeedrate} S${this.yProbeDirection}\nT-1\nM400\nG10 L20 Y${((this.yOffset)+(this.pluginCache.touchProbeEndmillDiameter/2))*-1*this.yDirection}\nG1 Y${-5*this.yDirection} F${this.pluginCache.touchProbeFeedrate}\nM400\nM500\nG1 Z${5+(this.pluginCache.touchProbeZDimension/2)} F${this.pluginCache.touchProbeFeedrate}\nG1 X${(((this.xDimension/2)-this.xOffset)*this.xDirection*(-1))} F${this.pluginCache.touchProbeFeedrate}\nG90\nG1 X0 Y0 F${this.pluginCache.touchProbeFeedrate}
      \nM563 P49 D-1 H-1\nM291 P"Probe complete. Please remove probe." R"Success" S1`;
      this.dialogPrompt = "Ensure the endmill is above the Start Here hole with the Touch Probe clip attached.";
      this.showTouchProbeConfirm = true;
    },
    async runProbeCode() {
      const content = this.probeCode;
			try {
				await this.upload({ filename: 'sys/probe.g', content });
        this.$emit('editComplete', 'probe.g');
        await this.sendCode(`M98 T0 Pprobe.g`)
			} catch (e) {
				// TODO Optionally ask user to save file somewhere else
			}
    },
    setCornerDirection() {
      if (this.pluginCache.touchProbeLocation == 'FR' || this.pluginCache.touchProbeLocation == 'BR'){
        this.xDirection = -1;
        this.xProbeDirection = 1;
      }else{
        this.xDirection = 1;
        this.xProbeDirection = 0;
      }
      if (this.pluginCache.touchProbeLocation == 'BL' || this.pluginCache.touchProbeLocation == 'BR'){
        this.yDirection = -1;
        this.yProbeDirection = 1;
      }else{
        this.yDirection = 1;
        this.yProbeDirection = 0;
      }
      if (this.pluginCache.touchProbeLocation == 'FL' || this.pluginCache.touchProbeLocation == 'BR'){
        this.xOffset = this.pluginCache.touchProbeXOffset;
        this.yOffset = this.pluginCache.touchProbeYOffset;
        this.xDimension = this.pluginCache.touchProbeXDimension;
        this.yDimension = this.pluginCache.touchProbeYDimension;
      }else{
        this.xOffset = this.pluginCache.touchProbeYOffset;
        this.yOffset = this.pluginCache.touchProbeXOffset;
        this.xDimension = this.pluginCache.touchProbeYDimension;
        this.yDimension = this.pluginCache.touchProbeXDimension;
      }
    },
  }
};
</script>

# DUET3D_CNC_Probe
CNC Probe plugin for DUET 3D boards (firmware 3.3 and above)


REMEMBER to attach both ends of the probe to the correct port and have it setup in your config.g, 
you also need to position the probe bit correctly before starting if you don't you may snap a bit
and no responsibility will be taken for any damage that may result.


I use out4 for my probe since it's wired like an endstop.

My config.g section

;out4 as XYZ probe

M558 P5  F500 C"!io4.in"   ; Set probe type 5, Speed 500mm/s and use IO4.in inverted



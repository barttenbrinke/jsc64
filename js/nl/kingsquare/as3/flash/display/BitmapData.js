/*
 * Copyright notice
 *
 * (c) 2009 Tim de Koning - Kingsquare Information Services.  All rights reserved.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 */

nl.kingsquare.as3.flash.display.BitmapData = Class.extend({
    
    init: function(context) {
        this.context = context;
        this.color_lookup_string = {};
        this.color_lookup_array = {};
        this.pixelData = null;
        this.pixelDataColorCache = null;
    },
    
    cachedColorString: function(color) {
      if (this.color_lookup_string[color] == null) {
        this.color_lookup_string[color] = 'rgba('+((color >> 16) & 0xFF) +
                ','+((color >> 8) & 0xFF)+','+(color & 0xFF)+
                ', '+((color >> 24) & 0xFF)/255+')';
      }
      
      return this.color_lookup_string[color];
    },
    
    cachedColorArray: function(color) {
      if (this.color_lookup_array[color] == null) {
        this.color_lookup_array[color] = [((color >> 16) & 0xFF), ((color >> 8) & 0xFF), (color & 0xFF), ((color >> 24) & 0xFF)];
      }

      return this.color_lookup_array[color];
    },

    fillRect: function(rect/*:Rectangle*/, color/*:uint*/) {
      this.context.clearRect(rect.x, rect.y, rect.width, rect.height);
      this.context.fillStyle = this.cachedColorString(color);
      this.context.fillRect(rect.x, rect.y, rect.width, rect.height);
    },

    setPixel32: function(x/*:int*/, y/*:int*/, color/*:uint*/) {
    	if (typeof color == 'undefined') color = 0;
    	if (typeof x == 'undefined') x = 0;
    	if (typeof y == 'undefined') y = 0;

  		// Not all browsers implement createImageData. On such browsers we obtain the
  		// ImageData object using the getImageData method. The worst-case scenario is
  		// to create an object *similar* to the ImageData object and hope for the best
  		// luck.
  		if (this.pixelData == null) {
    		if (this.context.createImageData) {
    			this.pixelData = this.context.createImageData(1, 1);
    		} else if (this.context.getImageData) {
    			this.pixelData = this.context.getImageData(x, y, 1, 1);
    		} else {
    			this.pixelData = {'width' : 1, 'height' : 1, 'data' : new Array(4)};
    		}
    	}
		
  		this.pixelDataColorCache = this.cachedColorArray(color);
		
      this.pixelData.data[0] = this.pixelDataColorCache[0];
      this.pixelData.data[1] = this.pixelDataColorCache[1];
      this.pixelData.data[2] = this.pixelDataColorCache[2];
      this.pixelData.data[3] = this.pixelDataColorCache[3];
        
  		// Draw the ImageData object.
  		this.context.putImageData(this.pixelData, x, y);
  	}
});
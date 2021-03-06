define(['knockout', 'infovis'],function(ko, infovis){
    var bindTableAndConfigOfBarAndLine = function(option,engine){
        return new function(){
            var self = this;
            var title = option.title[0];
            self.titleContent = ko.observable(title.text);
            self.titleTop = ko.observable(title.top);
            // self.titleLeft = ko.observableArray(["left","center","right"]);
            // self.selectedLeft = ko.observable(title.left);
            self.titleX = ko.observableArray(["left","center","right"]);
            self.selectedX = ko.observable(title.left);
            self.titleFontFamily = ko.observableArray(["SimSun","Microsoft YaHei","sans-serif","SimHei","KaiTi"]);
            self.selectedFontFamily = ko.observable(title.textStyle.fontFamily);
            self.titleFontSize = ko.observable(title.textStyle.fontSize);
            self.titleFontWeight = ko.observableArray(["normal","bold","bolder","lighter"]);
            self.selectedFontWeight = ko.observable(title.textStyle.fontWeight);
            self.titleFontStyle = ko.observableArray(["normal","italic","oblique"]);
            self.selectedFontStyle = ko.observable(title.textStyle.fontStyle);
            self.titleFontColor = ko.observable(title.textStyle.color);
            $("#titleFontColor").spectrum({
                showInput: true,
                allowEmpty:true,
                color: title.textStyle.color,
                change: function(color) {
                    self.titleFontColor(color.toHexString());
                }
            });

            self.subtitleContent = ko.observable(title.subtext);
            // self.subtitleLocation = ko.observableArray(["left","center","right"]);
            // self.subselectedLocation = ko.observable(title.textAlign);
            self.subtitleFontFamily = ko.observableArray(["SimSun","Microsoft YaHei","sans-serif","SimHei","KaiTi"]);
            self.subselectedFontFamily = ko.observable(title.subtextStyle.fontFamily);
            self.subtitleFontSize = ko.observable(title.subtextStyle.fontSize);
            self.subtitleFontWeight = ko.observableArray(["normal","bold","bolder","lighter"]);
            self.subselectedFontWeight = ko.observable(title.subtextStyle.fontWeight);
            self.subtitleFontStyle = ko.observableArray(["normal","italic","oblique"]);
            self.subselectedFontStyle = ko.observable(title.subtextStyle.fontStyle);
            self.subtitleFontColor = ko.observable(title.subtextStyle.color);
            $("#subtitleFontColor").spectrum({
                showInput: true,
                allowEmpty:true,
                color: title.subtextStyle.color,
                change: function(color) {
                    self.subtitleFontColor(color.toHexString());
                }
            });

            var tooltip = option.tooltip[0];
            self.tooltipShow = ko.observableArray(["显示","不显示"]);
            if(tooltip.show == false){
                self.selectedToolTipShow = ko.observable("不显示");
            }else if(tooltip.show == true){
                self.selectedToolTipShow = ko.observable("显示");
            }
            self.tooltipBorderWidth = ko.observable(tooltip.borderWidth);
            self.tooltipFontFamily = ko.observableArray(["SimSun","Microsoft YaHei","sans-serif","SimHei","KaiTi"]);
            self.selectedToolTipFontFamily = ko.observable(tooltip.textStyle.fontFamily);
            self.tooltipFontSize = ko.observable(tooltip.textStyle.fontSize);
            self.tooltipFontWeight = ko.observableArray(["normal","bold","bolder","lighter"]);
            self.selectedToolTipFontWeight = ko.observable(tooltip.textStyle.fontWeight);
            self.tooltipBorderColor = ko.observable(tooltip.borderColor);
            $("#tooltipBorderColor").spectrum({
                showInput: true,
                allowEmpty:true,
                color: tooltip.borderColor,
                change: function(color) {
                    self.tooltipBorderColor(color.toHexString());
                }
            });
            self.tooltipBackgroundColor = ko.observable(tooltip.backgroundColor);
            $("#tooltipBackgroundColor").spectrum({
                showInput: true,
                allowEmpty:true,
                color: tooltip.backgroundColor,
                change: function(color) {
                    self.tooltipBackgroundColor(color.toHexString());
                }
            });
            self.tooltipFontColor = ko.observable(tooltip.textStyle.color);
            $("#tooltipFontColor").spectrum({
                showInput: true,
                allowEmpty:true,
                color: tooltip.textStyle.color,
                change: function(color) {
                    self.tooltipFontColor(color.toHexString());
                }
            });

            //other
            if(JSON.stringify(option.backgroundColor).split(",").length<4){
                option.backgroundColor = 'rgba(255,255,255,1)';
            }
            var opacity = JSON.stringify(option.backgroundColor).split(",")[3].replace(')"','');
            self.backgroundOpacity = ko.observable(opacity*100);
            if(option.xAxis[0].axisLabel.rotate){
                self.xRotate = ko.observable(option.xAxis[0].axisLabel.rotate);
            }else{
                self.xRotate = ko.observable(0);
            }
            self.yAxisContent = ko.observable("");

            var optionChart = engine.chart.init(document.getElementById("optionContainer"));
            //每次被观察的数据变动后调用下列方法
            ko.computed(function(){

                //title
                option.title[0].text = self.titleContent();
                option.title[0].top = self.titleTop();
                // option.title[0].left = self.selectedLeft();
                option.title[0].left = self.selectedX();
                option.title[0].x = self.selectedX();
                option.title[0].textStyle.fontFamily = self.selectedFontFamily();
                option.title[0].textStyle.fontSize = self.titleFontSize();
                option.title[0].textStyle.fontWeight = self.selectedFontWeight();
                option.title[0].textStyle.fontStyle = self.selectedFontStyle();
                option.title[0].textStyle.color  = self.titleFontColor();

                //subtitle
                option.title[0].subtext = self.subtitleContent();
                // option.title[0].textAlign = self.subselectedLocation();
                option.title[0].subtextStyle.fontFamily = self.subselectedFontFamily();
                option.title[0].subtextStyle.fontSize = self.subtitleFontSize();
                option.title[0].subtextStyle.fontWeight = self.subselectedFontWeight();
                option.title[0].subtextStyle.fontStyle = self.subselectedFontStyle();
                option.title[0].subtextStyle.color  = self.subtitleFontColor();

                //tooltip
                if(self.selectedToolTipShow() == "不显示"){
                    option.tooltip[0].show = false;
                }else if(self.selectedToolTipShow() == "显示"){
                    option.tooltip[0].show = true;
                }
                option.tooltip[0].borderWidth = parseInt(self.tooltipBorderWidth());
                option.tooltip[0].textStyle.fontFamily = self.selectedToolTipFontFamily();
                option.tooltip[0].textStyle.fontSize = parseInt(self.tooltipFontSize());
                option.tooltip[0].textStyle.fontWeight = self.selectedToolTipFontWeight();
                option.tooltip[0].borderColor = self.tooltipBorderColor();
                option.tooltip[0].backgroundColor = self.tooltipBackgroundColor();
                option.tooltip[0].textStyle.color = self.tooltipFontColor();

                if(JSON.stringify(option.backgroundColor).split(",").length == 4){
                    option.backgroundColor = option.backgroundColor.split(",")[0]+","+option.backgroundColor.split(",")[1]+","+option.backgroundColor.split(",")[2]+","+self.backgroundOpacity()*0.01+")";
                }

                option.xAxis[0].axisLabel.rotate = self.xRotate();

                option.yAxis[0].name = self.yAxisContent();
                optionChart.setOption(option,true);
            }, this);
        };
    };

    var bindTableAndConfigOfPie = function(option,engine){
        return new function(){
            var self = this;
            var title = option.title[0];
            self.titleContent = ko.observable(title.text);
            self.titleTop = ko.observable(title.top);
            // self.titleLeft = ko.observableArray(["left","center","right"]);
            // self.selectedLeft = ko.observable(title.left);
            self.titleX = ko.observableArray(["left","center","right"]);
            self.selectedX = ko.observable(title.left);
            self.titleFontFamily = ko.observableArray(["SimSun","Microsoft YaHei","sans-serif","SimHei","KaiTi"]);
            self.selectedFontFamily = ko.observable(title.textStyle.fontFamily);
            self.titleFontSize = ko.observable(title.textStyle.fontSize);
            self.titleFontWeight = ko.observableArray(["normal","bold","bolder","lighter"]);
            self.selectedFontWeight = ko.observable(title.textStyle.fontWeight);
            self.titleFontStyle = ko.observableArray(["normal","italic","oblique"]);
            self.selectedFontStyle = ko.observable(title.textStyle.fontStyle);
            self.titleFontColor = ko.observable(title.textStyle.color);
            $("#titleFontColor").spectrum({
                showInput: true,
                allowEmpty:true,
                color: title.textStyle.color,
                change: function(color) {
                    self.titleFontColor(color.toHexString());
                }
            });

            self.subtitleContent = ko.observable(title.subtext);
            // self.subtitleLocation = ko.observableArray(["left","center","right"]);
            // self.subselectedLocation = ko.observable(title.textAlign);
            self.subtitleFontFamily = ko.observableArray(["SimSun","Microsoft YaHei","sans-serif","SimHei","KaiTi"]);
            self.subselectedFontFamily = ko.observable(title.subtextStyle.fontFamily);
            self.subtitleFontSize = ko.observable(title.subtextStyle.fontSize);
            self.subtitleFontWeight = ko.observableArray(["normal","bold","bolder","lighter"]);
            self.subselectedFontWeight = ko.observable(title.subtextStyle.fontWeight);
            self.subtitleFontStyle = ko.observableArray(["normal","italic","oblique"]);
            self.subselectedFontStyle = ko.observable(title.subtextStyle.fontStyle);
            self.subtitleFontColor = ko.observable(title.subtextStyle.color);
            $("#subtitleFontColor").spectrum({
                showInput: true,
                allowEmpty:true,
                color: title.subtextStyle.color,
                change: function(color) {
                    self.subtitleFontColor(color.toHexString());
                }
            });

            var tooltip = option.tooltip[0];
            self.tooltipShow = ko.observableArray(["显示","不显示"]);
            if(tooltip.show == false){
                self.selectedToolTipShow = ko.observable("不显示");
            }else if(tooltip.show == true){
                self.selectedToolTipShow = ko.observable("显示");
            }
            self.tooltipBorderWidth = ko.observable(tooltip.borderWidth);
            self.tooltipFontFamily = ko.observableArray(["SimSun","Microsoft YaHei","sans-serif","SimHei","KaiTi"]);
            self.selectedToolTipFontFamily = ko.observable(tooltip.textStyle.fontFamily);
            self.tooltipFontSize = ko.observable(tooltip.textStyle.fontSize);
            self.tooltipFontWeight = ko.observableArray(["normal","bold","bolder","lighter"]);
            self.selectedToolTipFontWeight = ko.observable(tooltip.textStyle.fontWeight);
            self.tooltipBorderColor = ko.observable(tooltip.borderColor);
            $("#tooltipBorderColor").spectrum({
                showInput: true,
                allowEmpty:true,
                color: tooltip.borderColor,
                change: function(color) {
                    self.tooltipBorderColor(color.toHexString());
                }
            });
            self.tooltipBackgroundColor = ko.observable(tooltip.backgroundColor);
            $("#tooltipBackgroundColor").spectrum({
                showInput: true,
                allowEmpty:true,
                color: tooltip.backgroundColor,
                change: function(color) {
                    self.tooltipBackgroundColor(color.toHexString());
                }
            });
            self.tooltipFontColor = ko.observable(tooltip.textStyle.color);
            $("#tooltipFontColor").spectrum({
                showInput: true,
                allowEmpty:true,
                color: tooltip.textStyle.color,
                change: function(color) {
                    self.tooltipFontColor(color.toHexString());
                }
            });

            var legend = option.legend[0];
            self.legendShow = ko.observableArray(["显示","不显示"]);
            if(legend.show == false){
                self.selectedLegendShow = ko.observable("不显示");
            }else if(legend.show == true){
                self.selectedLegendShow = ko.observable("显示");
            }
            self.legendTop = ko.observable(legend.top);
            self.legendLeft = ko.observable(legend.left);
            self.legendOrient = ko.observableArray(["横向","纵向"]);
            if(legend.orient == "horizontal"){
                self.selectedLegendOrient = ko.observable("横向");
            }else if(legend.orient == "vertical"){
                self.selectedLegendOrient = ko.observable("纵向");
            }
            self.legendItemGap = ko.observable(legend.itemGap);
            if(self.legendItemGap <= 0){
                self.legendItemGap = ko.observable(1);
            }
            self.legendIcon = ko.observableArray(["rect","circle","roundRect","triangle","diamond","pin","arrow"]);
            self.selectedLegendIcon = ko.observable(legend.icon);
            self.legendFontFamily = ko.observableArray(["SimSun","Microsoft YaHei","sans-serif","SimHei","KaiTi"]);
            self.selectedLegendFontFamily = ko.observable(legend.textStyle.fontFamily);
            self.legendFontSize = ko.observable(legend.textStyle.fontSize);
            self.legendFontWeight = ko.observableArray(["normal","bold","bolder","lighter"]);
            self.selectedLegendFontWeight = ko.observable(legend.textStyle.fontWeight);
            self.legendFontColor = ko.observable(legend.textStyle.color);
            $("#legendFontColor").spectrum({
                showInput: true,
                allowEmpty:true,
                color: legend.textStyle.color,
                change: function(color) {
                    self.legendFontColor(color.toHexString());
                }
            });

            if(JSON.stringify(option.backgroundColor).split(",").length<4){
                option.backgroundColor = 'rgba(255,255,255,1)';
            }
            var opacity = JSON.stringify(option.backgroundColor).split(",")[3].replace(')"','');
            self.backgroundOpacity = ko.observable(opacity*100);

            var optionChart = engine.chart.init(document.getElementById("optionContainer"));

            ko.computed(function(){
                //title
                option.title[0].text = self.titleContent();
                option.title[0].top = self.titleTop();
                option.title[0].left = self.selectedX();
                option.title[0].x = self.selectedX();
                option.title[0].textStyle.fontFamily = self.selectedFontFamily();
                option.title[0].textStyle.fontSize = self.titleFontSize();
                option.title[0].textStyle.fontWeight = self.selectedFontWeight();
                option.title[0].textStyle.fontStyle = self.selectedFontStyle();
                option.title[0].textStyle.color  = self.titleFontColor();

                //subtitle
                option.title[0].subtext = self.subtitleContent();
                // option.title[0].textAlign = self.subselectedLocation();
                option.title[0].subtextStyle.fontFamily = self.subselectedFontFamily();
                option.title[0].subtextStyle.fontSize = self.subtitleFontSize();
                option.title[0].subtextStyle.fontWeight = self.subselectedFontWeight();
                option.title[0].subtextStyle.fontStyle = self.subselectedFontStyle();
                option.title[0].subtextStyle.color  = self.subtitleFontColor();

                //tooltip
                if(self.selectedToolTipShow() == "不显示"){
                    option.tooltip[0].show = false;
                }else if(self.selectedToolTipShow() == "显示"){
                    option.tooltip[0].show = true;
                }
                option.tooltip[0].borderWidth = parseInt(self.tooltipBorderWidth());
                option.tooltip[0].textStyle.fontFamily = self.selectedToolTipFontFamily();
                option.tooltip[0].textStyle.fontSize = parseInt(self.tooltipFontSize());
                option.tooltip[0].textStyle.fontWeight = self.selectedToolTipFontWeight();
                option.tooltip[0].borderColor = self.tooltipBorderColor();
                option.tooltip[0].backgroundColor = self.tooltipBackgroundColor();
                option.tooltip[0].textStyle.color = self.tooltipFontColor();

                if(self.selectedLegendShow() == "不显示"){
                    option.legend[0].show = false;
                }else if(self.selectedLegendShow() == "显示"){
                    option.legend[0].show = true;
                }
                option.legend[0].top = self.legendTop();
                option.legend[0].left = self.legendLeft();
                if(self.selectedLegendOrient() == "横向"){
                    option.legend[0].orient = "horizontal";
                }else if(self.selectedLegendOrient() == "纵向"){
                    option.legend[0].orient = "vertical";
                }
                option.legend[0].itemGap = parseInt(self.legendItemGap());
                option.legend[0].icon = self.selectedLegendIcon();
                option.legend[0].textStyle.fontFamily = self.selectedLegendFontFamily();
                option.legend[0].textStyle.fontSize = parseInt(self.legendFontSize());
                option.legend[0].textStyle.fontWeight = self.selectedLegendFontWeight();
                option.legend[0].textStyle.color = self.legendFontColor();

                if(JSON.stringify(option.backgroundColor).split(",").length == 4){
                    option.backgroundColor = option.backgroundColor.split(",")[0]+","+option.backgroundColor.split(",")[1]+","+option.backgroundColor.split(",")[2]+","+self.backgroundOpacity()*0.01+")";
                }
                optionChart.setOption(option,true);
            },this)
        };

    };

    var bindTableAndConfigOfText = function(option,engine){
        return new function() {
            var that = this;
            this.text = ko.observable(option.text);
            this.textColor = ko.observable(option.textColor);
            this.color = ko.observable(option.color);
            this.strokeColor = ko.observable(option.strokeColor);
            this.fontSize = ko.observable(option.textFont.split(" ")[1].replace("px",""));

            $("#textColor").spectrum({
                showInput: true,
                allowEmpty:true,
                color: option.textColor,
                change: function(color) {
                    that.textColor(color.toHexString());
                }
            });

            $("#tagColor").spectrum({
                showInput: true,
                allowEmpty:true,
                color: option.color,
                showAlpha: true,
                change: function(color) {
                    var c = color.toRgb();
                    that.color("rgba(" + c.r + ", " + c.g + ", " + c.b + ", " + c.a + ")");
                }
            });


            $("#tagStrokeColor").spectrum({
                showInput: true,
                allowEmpty:true,
                color: option.strokeColor,
                showAlpha: true,
                change: function(color) {
                    var c = color.toRgb();
                    that.strokeColor("rgba(" + c.r + ", " + c.g + ", " + c.b + ", " + c.a + ")");
                }
            });


            ko.computed(function () {
                option.text = this.text();
                option.textColor = this.textColor();
                option.color = this.color();
                option.textFont = option.textFont.split(" ")[0] + " " +this.fontSize() + "px " + option.textFont.split(" ")[2];
                option.color = this.color();
                option.strokeColor = this.strokeColor();
                $("#textFontSize").text(this.fontSize());

                engine.render("textOptionContainer",option);
            },this);
        };
    };
    
    var bindTableAndConfigOfSubGroup = function(id,option,engine){
        return new function(){
            var self = this;
            self.subGroupText = ko.observable(option.text);
            self.subGroupTextColor = ko.observable(option.textColor);
            $("#subGroupTextColor").spectrum({
                showInput: true,
                allowEmpty:true,
                color: option.textColor,
                change: function(color){
                   self.subGroupTextColor(color.toHexString());
                }
            });
            self.subGroupFontSize = ko.observable(option.textFont.split(" ")[1].replace("px",""));
            self.subGroupImageWidth = ko.observable(option.width);
            self.subGroupImageHeight = ko.observable(option.height);

            ko.computed(function(){
                option.text = self.subGroupText();
                option.textColor = self.subGroupTextColor();
                option.textFont = option.textFont.split(" ")[0] + " " +self.subGroupFontSize()+ "px " + option.textFont.split(" ")[2];
                option.width = self.subGroupImageWidth();
                option.height = self.subGroupImageHeight();
                $("#subGroupFontSize").text(self.subGroupFontSize());

                engine.render(id,"",option);
            },this);
        };
    };

    return {
        bindTableAndConfigOfBarAndLine : bindTableAndConfigOfBarAndLine,
        bindTableAndConfigOfPie : bindTableAndConfigOfPie,
        bindTableAndConfigOfText : bindTableAndConfigOfText,
        bindTableAndConfigOfSubGroup : bindTableAndConfigOfSubGroup
    }
});
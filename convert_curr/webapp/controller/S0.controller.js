sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
	
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, JSONModel) {
		"use strict";

		return Controller.extend("pina.convertcurr.controller.S0", {

			onInit: function () {
				//Set Model to ComboBox
				this.setModels();             
			},

			setModels: function(oEvent){
			   var obj =  {};	
			   var listCurr = [];
               var finalList = {};

               var allCurr   = this.getView().getModel("moedasGeral").getData();
			   var validCurr = this.getView().getModel("moedasDisponiveis").getData().rates;

			   var keys = Object.keys(validCurr);  
			   
			  for( var i = 0; i < keys.length; i++ ){
				obj.curr = keys[i];
				obj.country = allCurr[keys[i]];
               
					 listCurr.push( obj );
					 obj =  {}
			    }
			  
				obj.curr = 'EUR';
				obj.country = 'Euro';               
			    listCurr.push( obj );

			  var oModel = new JSONModel(listCurr);
			  this.getView().setModel(oModel, "oMoedas");
			 
			},
			onConverter: function(oEvent){
			
				var currFrom   = this.getView().byId("currFrom").getValue().split(" - ")[1];
				var currTo     = this.getView().byId("currTo").getValue().split(" - ")[1];
				var valueFrom  = this.getView().byId("valorDe").getValue();
				var valueTo    = this.getView().byId("valorPara").getValue();
				var date       = this.getView().byId("date").getDateValue();
				//Format date to yyyy-mm-dd
				var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern :"yyyy-MM-dd" }); 
				var oDate      = dateFormat.format(new Date(date), false);  
				               
                
				var url = "https://api.exchangeratesapi.io/history?start_at=" + oDate + "&end_at=" + oDate + "&symbols=" + currTo + "&base=" + currFrom ;
				console.log(url);
                var oModel = new JSONModel(url);

				oModel.loadData(url,false);
				oModel.dataLoaded();
                debugger

				 var that = this;
				oModel.attachRequestCompleted( function(){ 

                    var date = this.getData().start_at;
					var currValue = this.getData().rates[date][currTo];

					var valConverted = valueFrom * currValue;

					var valorPara = that.getView().byId("valorPara").setValue(valConverted);
                    
					debugger
				})

			}
		});
	});

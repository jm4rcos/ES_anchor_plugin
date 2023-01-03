var anchor = {
  data: null,
  getConfigSetup: function () {
    ES.PluginMetadataConfigComponent = function (config) { // metadataType selectbox = filter for metadata type in combo
      config = config || {};
      //
      config.version = 'ext6';
      var nsCombo = new ES.NSCombo(config);
      var nsComboCmp = nsCombo.buildComponent();
      var nsEnumCombo = new ES.NSEnumCombo(Object.assign({ combo: nsComboCmp }, config));
      var nsEnumComboCmp = nsEnumCombo.buildComponent();
      //
      var txt = (config.fieldLabel) ? config.fieldLabel : '';
      var value = (config.defaultValue) ? config.defaultValue : '';
      var configElementName = ES.Utils.string.randomString(); //name ok?
      //
      return new Ext6.Panel({
        'title': txt,
        'name': configElementName,
        'value': value,
        'layout': 'table',
        'layoutConfig': { columns: 2 },
        'items': [nsComboCmp, nsEnumComboCmp],
        'getValue': function () {
          var ret = nsComboCmp.getValue() + '/' + nsEnumComboCmp.getValue();
          return (ret === '/') ? null : ret;
        },
        'setValue': function (value) {
          if (value == null) { return; }
          var mdt = value.split('/');
          if (mdt.length != 2) { return; }
          nsComboCmp.setValue(mdt[0]);
          nsEnumComboCmp.setValue(mdt[1]);
        },
        'listeners': { 'afterrender': function (comp) { this.setValue(this.value); } }
      });
    }
    
    var mdtSet = new ES.PluginMetadataConfigComponent({
      fieldLabel: this.getTranslation("mdtSet", "Metadata Set"),
    });

    var configPanel = new Ext6.form.Panel({
      items: [
        mdtSet,
      ],
    });

    var config = {};
    config.customUI = true;
    config.initFunction = function (configValues) {
      mdtSet.setValue(configValues.mdtSet);
      return configPanel;
    };
    config.okFunction = function () {
      var configValues = {};
      configValues.mdtSet = mdtSet.getValue();
      return configValues;
    };

    return config;
  },
  buildComponent: function (buildComponent, self) {
    var frame = document.createElement("div");
    frame.id = "frame";
    frame.innerText = "Anchor Component"

    container = document.createElement("div");
    container.id = "container";

    var box = document.createElement("div");
    box.setAttribute("id", "box");

    // this.$self = self;
    
    container.appendChild(box);
    frame.appendChild(container);

    this.$loaded = false

    return frame;
  },
  update: function () {
    var box = document.querySelector("#box")

    if(!this.$loaded) {
      this.$loaded = true;
      this.getBox(box);
    }

  },
  changeMetadata: function(metadata, value){
    this.setModelProperty(metadata, value);
    var mdt = this.getModelProperty(metadata);
    console.log("mdt: ", mdt);
  },
  
  getBox: function(div){
    const boxes = [
      [0, "top_left"],
      [1, "top_center"],
      [2, "top_right"],
      [3, "center_left"],
      [4, "center_center"],
      [5, "center_right"],
      [6, "bottom_left"],
      [7, "bottom_center"],
      [8, "bottom_right"],
    ];

    var config = this.getConfig();

    function getClick(evt){
      //Propriedades criadas no evento caso necessario para serem usadas como parametro
      // console.log(
      //   evt.currentTarget.selectedIndex,
      //   evt.currentTarget.index,
      // );

      //Isto vai criar uma NodeList com a "div" que esta sendo retornada como argumento
      //E assim sera possivel nao mapear mas fazer um loop na NodeList
      var children = div.childNodes;
      children.forEach((child) => {
        if(child.innerText === evt.currentTarget.inner){
          child.style.background = "#2596be";
          // child.style.backgroundColor = config.backgroundColor
        } else{
          child.style.background = "#5684";
        }
      })
    }
    
    boxes.map((i, index) => {
      let item = document.createElement("button");
      item.setAttribute("id", "item");
      item.innerText = i[1];

      item.addEventListener("click", getClick, false);
      item.selectedIndex = i[0];
      item.index = index;
      item.inner = item.innerText

      item.addEventListener("click", () => {
        this.changeMetadata("MetaData/:" + config.mdtSet, i[1]);
      });

      return div.appendChild(item);
    });
    
  }
};
/**********************************************
 * Container for: lists: i.e. videos, images
 * Container for: modal and item state info
 *
 * Change these vars when moving from locally stored media to media stored on a web server:
 * var videoPath = '../videos/';//change this to http:// for non-local videos hosted on a web server
 * var imagePath = '../images/';//change this to http:// for non-local videos hosted on a web server
 *
 * ListItems.js
  ********************************************/

var React=require('react');
var PropTypes=require('prop-types');
var mediaJSON=require('json-loader!./ListItems/Media.json');//JSON file containing the videos
var Modal = require('./Modal');
var Items = require('./ListItems/Items');
var ItemPlayer = require('./ListItems/ItemPlayer');
var videoPath = '../videos/';//change this to http:// for non-local videos hosted on a web server
var imagePath = '../images/';//change this to http:// for non-local videos hosted on a web server
var videoAutoPlay = true;//change this to prevent video auto playing

class ListItems extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            typeOfMedia: this.props.typeOfMedia,
            isModalOpen: false,
            currentItem: null,
            mediaData: mediaJSON,
            videoAutoPlay: videoAutoPlay,
            allItemData: [],
            sections: [],
            itemPath: '',
            ModalControls: new Modal({self: this})
        };
    }
    itemClicked(clickedItemSrc){
        this.setState({itemClicked:clickedItemSrc}, function(){
            this.state.ModalControls.playItem(clickedItemSrc);
        });
    }
    itemLikeClicked(clickedLikeItemSrc){
        if(this.isThisItemLiked(clickedLikeItemSrc)){
            var newState = '';
            this.unsetItemToLiked(clickedLikeItemSrc);
        }
        else{
            var newState = clickedLikeItemSrc;
            this.setItemToLiked(clickedLikeItemSrc);
        }
        this.setState({itemLiked:newState});
    }
    setItemToLiked(itemSrc){
        this.state.allItemData[this.itemPosition(itemSrc)].itemIsLiked=true;
    }
    unsetItemToLiked(itemSrc){
        this.state.allItemData[this.itemPosition(itemSrc)].itemIsLiked=false;
    }
    isThisItemLiked(itemSrc){
        if(itemSrc === null){ return false }
        return (
            (this.state.allItemData[this.itemPosition(itemSrc)].itemIsLiked) ? true : false
        );
    }
    isThisItemWatched(itemSrc){
        var returnValue=false;
        var currentPosition=this.state.allItemData.map(function(item,index){
            if((item.src == itemSrc) && item.watched == true){
                returnValue=true;
            }
        });
        return returnValue;
    }
    itemPosition(itemSrc){
        var thisItemPosition;
        var currentPosition=this.state.allItemData.map(function(item,index){
            (item.src == itemSrc) ? thisItemPosition=index : null;
        });
        return thisItemPosition;
    }
    totalItems(){
        return this.state.allItemData.length;
    }
    addToWatchedItems(thisItemSrc){
        this.state.allItemData[this.itemPosition(thisItemSrc)].watched=true;
    }
    buildItemsStateTable(){
        var mediaData=this.state.mediaData;//pull in the data from JSON
        mediaData=(this.state.typeOfMedia=='videos') ? mediaData.videos : mediaData.images;//remove the bits we do not need

        var sectionsArray=[];//build an array of sections
        var sections = mediaData.map(function(itemData){
            (sectionsArray.indexOf(itemData.section) === -1 ) ? sectionsArray.push(itemData.section) : null;
        });

        //order array based on sections (i.e. so it is ready to render to the lists)
        var itemsArrayOrdered=[];
        var sections = sectionsArray.map(function(section, index){
            var itemOrdering=mediaData.map(function(item, index2){
                (item.section == section) ? itemsArrayOrdered.push(item) : null;
            });
            return section;
        });

        this.setState({
            allItemData: itemsArrayOrdered,
            sections: sections
        });
    }
    componentWillMount(){
        this.buildItemsStateTable();//build the arrays of items and sections
        (this.state.typeOfMedia == 'videos') ? this.setState({ itemPath : videoPath}) : this.setState({ itemPath : imagePath});//select the path based on typeOfMedia
    }
    render(){
        return (
                <div className={"mediaType_"+this.state.typeOfMedia}>
                    <div className="itemPlayerContainer">
                        <div className="col-sm-1 col-md-2" />
                        <div className="col-sm-10 col-md-8 section-container">
                            <Items
                                typeOfMedia={this.state.typeOfMedia}
                                allItemData={this.state.allItemData}
                                sections={this.state.sections}
                                itemPath={this.state.itemPath}
                                itemClicked={this.itemClicked.bind(this)}
                                itemLikeClicked={this.itemLikeClicked.bind(this)}
                                isThisItemLiked={this.isThisItemLiked.bind(this)}
                                isThisItemWatched={this.isThisItemWatched.bind(this)}
                            />
                        </div>
                        <div className="col-sm-1 col-md-2" />
                        <Modal
                            isOpen={this.state.isModalOpen}
                            onClose={() => this.state.ModalControls.closeModal()}
                        >
                            {this.state.ModalControls.likeItemButton(this.state.currentItem)}
                            {this.state.ModalControls.renderSkipButton('prev')}
                            {this.state.ModalControls.renderSkipButton('next')}
                            <ItemPlayer
                                src={this.state.itemPath+this.state.currentItem}
                                typeOfMedia={this.state.typeOfMedia}
                                autoPlay={this.state.videoAutoPlay} />
                        </Modal>
                    </div>
                </div>
        );
    }
}
module.exports=ListItems;

ListItems.propTypes={
    typeOfMedia: PropTypes.string.isRequired
};
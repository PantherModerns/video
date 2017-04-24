/*
 ********************************************************************************
     Creates the list item elements - i.e. click-able link: Like Icon, Title

     ItemListComponent
 ********************************************************************************
 */

var React=require('react');

class ItemListComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            componentIndex: this.props.componentIndex,
            numItemsRendered: this.props.numItemsRendered,
            itemComponentData: this.props.itemComponentData,
            liked: this.props.liked,
            doOnClick: this.props.doOnClick,
            typeOfMedia: this.props.typeOfMedia
        };
    }
    likeChange(e){
        if(this.state.liked==true){
           this.setState({liked: false});
        }
        else{
            this.setState({liked: true});
        }
    }
    //playItem(event){
    //    console.log('itemListComponent.js - playItem()');
    //    selfReference.playItem();
    //}

    openModal() {
        this.setState({ isModalOpen: true })
    }
    closeModal() {
        this.setState({ isModalOpen: false })
    }
    render(){
        return(
            <li key={this.state.componentIndex}>
                <div className={(this.state.liked) ? 'glyphicon glyphicon-heart liked' : 'glyphicon glyphicon-heart'} id={"like_"+this.state.numItemsRendered} onClick={ (e)=> this.likeChange(e) } key={'like_'+this.state.componentIndex} />
                <a href="#" key={"link_"+this.state.componentIndex} onClick={this.state.doOnClick} data-src={this.state.itemComponentData.src} id={'video_'+this.state.numItemsRendered} >
                    {this.state.itemComponentData.title}
                </a>
            </li>
        );
    }
}

module.exports=ItemListComponent;
var React=require('react');

class VideoPlayer extends React.Component{
        render(){
            return(
                <div className="video-container">
                    <video controls type="video/mp4" id="videoPlayer" preload src={this.props.src} ref="video" autoPlay={this.props.autoPlay} ></video>
                </div>
            )
        }
};
module.exports=VideoPlayer;

//nicely designed and implemented version of the code
var React=require('react');
//var ReactDOM=require('react-dom');
var videosJSON = require('json-loader!./Videos.json');//JSON file containing the videos
var videoPath = '../videos/';//change this to http:// for non-local videos hosted on a web server

var videosSectionArray = new Array();
var videosData = new Array();

var Videos=React.createClass({

    getInitialState: function(){
        return {
            currentVideo: 'starting_the_compressor.mp4',
            videoAutoplay: '',
            videoSectionData: ''
        };
    },

    changeColor: function(){
        var newColor = this.state.color == green ? red : green;
        this.setState({color : newColor });
    },

    createVideoSections: function(videoSection){
        //build an array of the various sections
        if(videosSectionArray.indexOf(videoSection)===-1) {
            videosSectionArray.push(videoSection);
        }

        //todo add the array to state
        return videosSectionArray;

    },

    createVideoContentsArrays: function(video){
        this.createVideoSections(video.section);//add all sections to an array

        var currentVideoData=[
            video.title,video.src,video.subsection
        ];

        var currentSectionIndex=videosSectionArray.indexOf(video.section);
        var currentVideosDataArrayRowContents=videosData[currentSectionIndex];//contents of the row at the moment

        if(currentVideosDataArrayRowContents!=undefined){
            currentVideosDataArrayRowContents.push(currentVideoData);
            videosData[currentSectionIndex]=currentVideosDataArrayRowContents; //add this video data to the array row that already exisits
        }
        else{
            videosData.push([currentVideoData]);
        }
    },

    playVideo: function(videoSrc){
        var videoToPlay = videoSrc;
        this.setState({currentVideo: videoSrc});
        this.setState({videoAutoPlay: 'autoplay'});
        this.refs.video.play();
    },

    createLists: function(listData){
        listData.map(this.createVideoContentsArrays);
    },

    componentWillMount: function(){
       var self=this;//used for the <li> onClicks

       this.createLists(videosJSON.videos );//ingest the data from the JSON file

        var videoSectionsData = videosSectionArray.map(function(headingName, index){
            var sectionData =  videosData[index].map(function(dataElements, index2){
                return (
                    <li key={index2} >
                        <a href="#"  onClick={ () => self.playVideo(dataElements[1]) } >
                            {dataElements[0]}
                        </a>
                    </li>
                );
            });

            return (
                <div key={index}>
                    <h3>{headingName}</h3>
                    <ul>{sectionData}</ul>
                </div>
            )
        });

        this.setState({videoSectionData: videoSectionsData});
    },

    render: function () {
        var currentVideo = videoPath+this.state.currentVideo;
        var videoAutoPlay = this.state.videoAutoPlay;
        var videoSectionsData = this.state.videoSectionData;

        return (
            <div>
                <div className="video-container">
                    <video controls type="video/mp4" id="videoPlayer" preload src={currentVideo} ref="video" autoPlay={videoAutoPlay} ></video>
                </div>
                <div className="choose-video">
                    {videoSectionsData}
                </div>
            </div>
        );
    }
});

module.exports=Videos;
import * as React from 'react';
import { findDOMNode } from 'react-dom/test-utils';
import { scryRenderedDOMComponentsWithClass as findByClass } from 'react-dom/test-utils';
import expect from 'expect';
import {renderIntoDocument} from 'react-dom/test-utils';
import {Simulate} from 'react-dom/test-utils';
import Common from 'test/common.js';
import ItemListComponent from './ItemListComponent';
const hostName = (window.location.hostname == '' ) ? '' : 'http://localhost:8081/';

const itemComponentData={title:'test link', src:'videos/drum_pick-up.mp4', src_thumbnail:'videos/drum_pick-up.png'};
const numItemsRendered=1;
const testData = [
  { title: 'LIKED item, UNWATCHED', itemComponentData: itemComponentData, numItemsRendered: numItemsRendered, src: itemComponentData.src, itemIsLiked:true, itemIsWatched:false },
  { title: 'UNLIKED item, UNWATCHED', itemComponentData: itemComponentData, numItemsRendered: numItemsRendered, src: itemComponentData.src, itemIsLiked:false, itemIsWatched:false },
  { title: 'LIKED item, WATCHED', itemComponentData: itemComponentData, numItemsRendered: numItemsRendered, src: itemComponentData.src, itemIsLiked:true, itemIsWatched:true },
  { title: 'UNLIKED item, WATCHED', itemComponentData: itemComponentData, numItemsRendered: numItemsRendered, src: itemComponentData.src, itemIsLiked:false, itemIsWatched:true },
];

function itemClicked(e){
  //do nothing
}
function itemLikeClicked(e){
  //do nothing
}
describe('App/components/ListItems/ListComponent', function(){
    testData.map((testDataItem)=>{
        let item = renderIntoDocument(
                <ItemListComponent
                    numItemsRendered={testDataItem.numItemsRendered}
                    itemComponentData={itemComponentData}
                    src={itemComponentData.src}
                    itemIsLiked={testDataItem.itemIsLiked}
                    itemIsWatched={testDataItem.itemIsWatched}
                    itemPath={hostName}
                    itemClicked={itemClicked}
                    itemLikeClicked={itemLikeClicked}
                />
        );
        it(testDataItem.title + ' -> item exists', (done)=>{
              expect(item).toExist();
              done();
        });
        it(testDataItem.title + ' -> state data', (done)=>{
              expect(item.state.numItemsRendered).toEqual(testDataItem.numItemsRendered);
              expect(item.state.itemIsLiked).toEqual(testDataItem.itemIsLiked);
              expect(item.state.itemIsWatched).toEqual(testDataItem.itemIsWatched);
              expect(item.state.itemComponentData.src).toEqual(itemComponentData.src);
              done();
        });
        it(testDataItem.title + '-> link text', (done)=>{
              let linkObj = item.refs['item_'+parseInt(numItemsRendered)];
              expect(item.refs.linkText.innerHTML).toBe(itemComponentData.title);
              done();
        });
        it(testDataItem.title + '-> CSS of LIKE', (done)=>{
              let linkObj = item.refs['like_'+parseInt(numItemsRendered)];
              (testDataItem.itemIsLiked===true) ? expect(linkObj.className).toContain('liked') : expect(linkObj.className).toNotContain('liked');
              done();
        });
        it(testDataItem.title + '-> CSS of WATCHED', (done)=>{
              let linkObj = item.refs['item_'+parseInt(numItemsRendered)];
              (testDataItem.itemIsWatched) ? expect(linkObj.className).toBe('watched') : expect(linkObj.className).toBe('');
              done();
        });
        it(testDataItem.title + '-> click LINK and check WATCHED State and className are toggled correctly', (done)=>{
          item.itemClicked();
          let linkObj = item.refs['item_'+parseInt(numItemsRendered)];
          expect(item.state.itemIsWatched).toBe(true);//check the state
          expect(linkObj.className).toBe('watched');//check the className
          done();
        });
        it(testDataItem.title + '-> click LIKE and check LIKED State and className', (done)=>{
            //click the time to toggle
            item.itemLikeClicked();
            let linkObj = item.refs['like_'+parseInt(numItemsRendered)];
            if(testDataItem.itemIsLiked){
              expect(item.state.itemIsLiked).toBe(false);//check the state
              expect(linkObj.className).toNotContain('liked');//check the className
            }
            else{
              expect(item.state.itemIsLiked).toBe(true);//check the state
              expect(linkObj.className).toContain('liked')//check the className
            }
            //click again to ensure state toggles back to the original state
            item.itemLikeClicked();
            linkObj = item.refs['like_'+parseInt(numItemsRendered)];
            if(testDataItem.itemIsLiked){
              expect(item.state.itemIsLiked).toBe(true);//check the state
              expect(linkObj.className).toContain('liked');//check the className
            }
            else{
              expect(item.state.itemIsLiked).toBe(false);//check the state
              expect(linkObj.className).toNotContain('liked')//check the className
            }
            done();
        });
        it(testDataItem.title + '-> background image', (done)=>{
          let linkObj = item.refs['item_'+parseInt(numItemsRendered)];
          expect(linkObj.style.backgroundImage).toBe('url(\"'+item.props.itemPath+item.state.itemComponentData.src_thumbnail+'\")');
          done();
        });

    });

});

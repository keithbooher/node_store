import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { updateManyProducts, galleryProducts } from "../../../utils/API"
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { dispatchEnlargeImage } from "../../../actions"
// fake data generator
const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`
  }));

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250
});

class GalleryDisplayOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: null
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  async componentDidMount() {
    let { data } = await this.props.galleryProducts()

    // takes care of any that dont have a real order assigned to them yet, but rather there place holder zero
    data = data.map(prod => {
      if (!prod.gallery_order) {
        prod.gallery_order = 0
      }
      return prod
    }).sort((a, b) => a.gallery_order - b.gallery_order).map((prod, i) => {
      prod.gallery_order = i
      return prod
    })

    this.setState({ items: data })
  }

  async onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = await this.reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items
    });
  }

  // a little function to help us with reordering the result
  async reorder(list, startIndex, endIndex) {
    let result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    result = result.map((prod, index) => {
      prod.gallery_order = index
      return prod
    })

    // I dont think this actually needs to be async
    await this.props.updateManyProducts(result)

    return result;
  };

  render() {
    console.log(this.state)
    return (
      <div style={{ marginTop: "30px", maxHeight: "100vh", overflow: "scroll" }}>
        {this.state.items && 
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{...getListStyle(snapshot.isDraggingOver), ...{width: "100%"}}}
                >
                  {this.state.items.map((item, index) => {
                    return (
                      <Draggable key={item.gallery_order} draggableId={`${item.gallery_order}`} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <div className="flex">
                              <div className="flex justify-center align-items-center">
                                <div className="margin-s-h">
                                  {item.gallery_order}
                                </div>
                              </div>
                              <LazyLoadImage
                                src={item.images.i1}
                                wrapperClassName={`${this.props.mobile ? "display_order_image_mobile" : "display_order_image"} border-radius-s`}
                                onClick={() => this.props.dispatchEnlargeImage({image: item.images.i1, path: "/shop/" + item.categories[0].path_name + "/" + item.path_name })}
                              />
                              <div className="flex justify-center align-items-center">
                                <div className="margin-s-h">
                                  {item.name}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    )
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        }
      </div>
    )
  }
}

function mapStateToProps({ mobile, enlargeImage }) {
  return { mobile, enlargeImage }
}

const actions = { galleryProducts, updateManyProducts, dispatchEnlargeImage }


export default connect(mapStateToProps, actions)(GalleryDisplayOrder)

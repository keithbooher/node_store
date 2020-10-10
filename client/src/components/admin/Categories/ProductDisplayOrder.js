import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getCategoryProducts_displayOrder, updateManyProducts } from "../../../utils/API"

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

class ProductDisplayOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: null
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  async componentDidMount() {
    let { data } = await this.props.getCategoryProducts_displayOrder(this.props.data._id)
    console.log(data)
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
      prod.category_display_order[this.props.data._id] = index
      return prod
    })

    // I dont think this actually needs to be async
    await this.props.updateManyProducts(result)

    return result;
  };

  render() {
    console.log(this.props)
    return (
      <div style={{ marginTop: "30px" }}>
        {this.state.items && 
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {this.state.items.map((item, index) => (
                    <Draggable key={item.category_display_order[this.props.data._id]} draggableId={`${item.category_display_order[this.props.data._id]}`} index={index}>
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
                          {item.name} - {item.category_display_order[this.props.data._id]}
                        </div>
                      )}
                    </Draggable>
                  ))}
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

function mapStateToProps({ mobile }) {
  return { mobile }
}

const actions = { getCategoryProducts_displayOrder, updateManyProducts }


export default connect(mapStateToProps, actions)(ProductDisplayOrder)

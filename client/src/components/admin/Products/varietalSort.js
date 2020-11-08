
const varietalSort = (data) => {
  let sorted = {
    colors: [],
    sizes: []
  }

  if (data.length === 0) {
    return sorted
  }

  data.forEach(varietal => {
    if (varietal.type === "color") {
      sorted.colors.push(varietal)
    } else {
      sorted.sizes.push(varietal)
    }
  });

  return sorted
}

export default varietalSort
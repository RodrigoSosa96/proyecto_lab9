import api, { openlibraryAPI } from "./api";

export const getBooks = async (isbn) => {
  try {
    const res = await api.get(`/books/${isbn ? isbn : ''}`)
    return res.data
  } catch {
    return { error: "GET error" }
  }
}

export const postBook = async (data) => {
  try {
    const book = await getBooks(data.isbn)
    if (book?.isbn) return { error: "Libro ya existe" }

    const res = await api.post("/books", data)
    return res.data
  } catch {
    return { error: "POST error" }

  }
}

export const putBook = async (data) => {
  try {
    console.log(data)
    const book = await getBooks(data.isbn)
    if (!book?.isbn) return { error: "Libro no encontrado" }

    const res = await api.put(`/books/${data.isbn}`, data)
    return res.data
  } catch {
    return { error: "PUT error" }
  }
}

export const deleteBook = async (isbn) => {
  try {
    if(Array.isArray(isbn)) {
      let res = await Promise.all(isbn.map(async (id) => {
        try {
          await api.delete(`/books/${id}`)
          return {}
        } catch (err) {
          return { error: "DELETE error" }
        }

      }))
      if (res.some(res => res.error)) return { error: "DELETE error Array" }
      return
    }
    const res = await api.delete(`/books/${isbn}`)
    return res.data

  } catch {
    return { error: "DELETE error" }
  }
}




export const getLibrary = async (isbn) => {
  try {
    const res = await openlibraryAPI.get("/books", {
      params: {
        bibkeys: `ISBN:${isbn}`,
        format: "json",
        jscmd: "data"
      }
    })

    if (res.data[`ISBN:${isbn}`]) {
      return res.data[`ISBN:${isbn}`]
    }

    return { error: "No se encontrĂ³ el ISBN" }
  } catch {
    return { error: "GET error" }
  }
}
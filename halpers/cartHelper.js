export const CartDataOrganizer = (data) => {
    return {
        id: data._id,
        userId: data.userId,
        items: data.items.map(item => ({
            bookId: item.bookId,
            title: item.title,
            price: item.price,
            coverImage: item.coverImage,
            author: item.author,
            quantity: item.quantity
        })),
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
    }
}
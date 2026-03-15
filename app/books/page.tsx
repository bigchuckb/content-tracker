import { readData } from "@/lib/db";
import type { BookEntry } from "@/lib/types";
import FeedItem from "@/components/FeedItem";
import BookForm from "@/components/BookForm";

export default function BooksPage() {
  const books = readData<BookEntry>("books").sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Books</h1>
      <div className="grid md:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="space-y-3">
          {books.length === 0 ? (
            <div className="text-center py-16 text-[#9ab]">
              <p className="text-4xl mb-3">📖</p>
              <p className="text-sm">No books logged yet. Add your first one!</p>
            </div>
          ) : (
            books.map((book) => <FeedItem key={book.id} entry={book} />)
          )}
        </div>
        <div className="md:sticky md:top-6">
          <BookForm />
        </div>
      </div>
    </div>
  );
}

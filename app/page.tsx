import ImageGallery from "./components/ImageGallery";

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Image Gallery</h1>
      <ImageGallery />
    </main>
  );
}

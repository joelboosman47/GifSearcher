import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GiphyGif } from "@/lib/types";
import { Copy, Download } from "lucide-react";

interface PreviewModalProps {
  gif: GiphyGif;
  isOpen: boolean;
  onClose: () => void;
  onCopy: () => void;
  onDownload: () => void;
}

const PreviewModal = ({ gif, isOpen, onClose, onCopy, onDownload }: PreviewModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>GIF Preview</DialogTitle>
        </DialogHeader>
        <div className="p-2">
          <img 
            src={gif.images.original.url} 
            alt={gif.title || "GIF preview"} 
            className="w-full rounded-lg"
          />
        </div>
        <div className="flex">
          <Button 
            variant="outline" 
            className="flex-1 mr-2"
            onClick={onCopy}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button 
            className="flex-1 ml-2 bg-secondary hover:bg-green-600"
            onClick={onDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;

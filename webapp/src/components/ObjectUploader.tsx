import { useState } from "react";
import type { ReactNode } from "react";
import Uppy from "@uppy/core";
import { DashboardModal } from "@uppy/react";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import AwsS3 from "@uppy/aws-s3";
import type { UploadResult } from "@uppy/core";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  onGetUploadParameters: () => Promise<{
    method: "PUT";
    url: string;
  }>;
  onComplete?: (
    result: UploadResult<Record<string, unknown>, Record<string, unknown>>
  ) => void;
  buttonClassName?: string;
  children: ReactNode;
}

/**
 * A file upload component that renders as a button and provides a modal interface for
 * file management.
 * 
 * Features:
 * - Renders as a customizable button that opens a file upload modal
 * - Provides a modal interface for:
 *   - File selection
 *   - File preview
 *   - Upload progress tracking
 *   - Upload status display
 * 
 * The component uses Uppy under the hood to handle all file upload functionality.
 * All file management features are automatically handled by the Uppy dashboard modal.
 */
export function ObjectUploader({
  maxNumberOfFiles = 1,
  maxFileSize = 10485760, // 10MB default
  onGetUploadParameters,
  onComplete,
  buttonClassName,
  children,
}: ObjectUploaderProps) {
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();
  
  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        maxNumberOfFiles,
        maxFileSize,
        allowedFileTypes: ['image/*'],
      },
      autoProceed: false,
    })
      .use(AwsS3, {
        shouldUseMultipart: false,
        getUploadParameters: onGetUploadParameters,
      })
      .on("complete", (result) => {
        setShowModal(false);
        onComplete?.(result);
        if (result.successful.length > 0) {
          toast({
            title: "¡Subida exitosa!",
            description: `${result.successful.length} archivo(s) subido(s) correctamente.`,
          });
        }
      })
      .on("error", (error) => {
        toast({
          title: "Error de subida",
          description: "Hubo un problema al subir el archivo. Inténtalo de nuevo.",
          variant: "destructive",
        });
        console.error("Upload error:", error);
      })
  );

  return (
    <div>
      <Button 
        onClick={() => setShowModal(true)} 
        className={`bg-chalk-green text-blackboard hover:bg-opacity-80 transition-all duration-200 ${buttonClassName}`}
      >
        {children}
      </Button>

      <DashboardModal
        uppy={uppy}
        open={showModal}
        onRequestClose={() => setShowModal(false)}
        proudlyDisplayPoweredByUppy={false}
        theme="dark"
        locale={{
          strings: {
            dropPasteFiles: 'Arrastra archivos aquí o %{browseFiles}',
            browseFiles: 'selecciona',
            upload: 'Subir',
            cancel: 'Cancelar',
            retry: 'Reintentar',
            remove: 'Eliminar',
            addMore: 'Agregar más',
            done: 'Hecho',
            uploadComplete: '¡Subida completa!',
          }
        }}
      />
    </div>
  );
}

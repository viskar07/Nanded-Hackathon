"use client";

import { FormGenerator } from "@/components/global/form-generator";
import { Loader } from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FACILITY_CREATION_FORM } from "@/constants/form";
import { useCreateFacility } from "@/hooks/institution";
import '@uploadcare/react-uploader/core.css';
import { FileUploaderRegular } from '@uploadcare/react-uploader/next';

const FacilityForm = ({ institutionId }: { institutionId: string }) => {
    const { onSubmit, register, errors, setValue, isPending } = useCreateFacility({ institutionId });

    const handleFileSelect = (info: any) => {
        if (info && info.uuid) {
            setValue("images", info.uuid); // Store the UUID in the form
        }
    };

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {/* Using reusable input field for facility name and description */}
            {FACILITY_CREATION_FORM.map((field) => (
        <FormGenerator key={field.id} {...field} register={register} errors={errors}  />
      ))}
          
            
            <Label htmlFor="uploadcare">Facility Images</Label>
            <FileUploaderRegular
                sourceList="local"
                classNameUploader="uc-light"
                pubkey={process.env.NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY as string}
                onChange={handleFileSelect}
            />
            {errors.images && <p className="text-red-600">{errors.images.message}</p>} {/* Display image upload error */}

            <Button type="submit" disabled={isPending}>
                <Loader loading={isPending}>Create Facility</Loader>
            </Button>
        </form>
    );
};

export default FacilityForm;
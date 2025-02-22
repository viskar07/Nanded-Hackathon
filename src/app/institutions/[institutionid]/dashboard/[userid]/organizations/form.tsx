// hooks/useOrganizationForm.ts
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const OrganizationSchema = z.object({
    name: z.string().min(2, { message: "Organization name must be at least 2 characters." }),
    background: z.string().optional(),
    jsonDescription: z.string().optional(),
    htmlDescription: z.string().optional(),
    type: z.nativeEnum(OrganizationType),
    achievements: z.string().optional(),
    departmentId: z.string().optional(),
});

export type OrganizationSchemaType = z.infer<typeof OrganizationSchema>;

interface UseOrganizationFormProps {
    onSubmit: (data: OrganizationSchemaType) => void;
    defaultValues?: Partial<OrganizationSchemaType>;
}

export const useOrganizationForm = ({ onSubmit, defaultValues }: UseOrganizationFormProps) => {
    const form = useForm<OrganizationSchemaType>({
        resolver: zodResolver(OrganizationSchema),
        defaultValues: defaultValues || {
            name: '',
            background: '',
            jsonDescription: '',
            htmlDescription: '',
            type: OrganizationType.Club,
            achievements: '',
            departmentId: '',
        },
    });

    const {
        handleSubmit,
        register,
        formState: { errors },
        control,
        reset,
        setValue,
        trigger,
        watch
    } = form;

    const submitHandler = handleSubmit((data) => {
        onSubmit(data);
    });

    return {
        form,
        register,
        handleSubmit: submitHandler,
        errors,
        control,
        reset,
        setValue,
        trigger,
        watch
    };
};

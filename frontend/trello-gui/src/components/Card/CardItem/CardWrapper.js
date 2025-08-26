import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function CardWrapper({ children, id, data }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
        data,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : undefined
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
}

export default CardWrapper

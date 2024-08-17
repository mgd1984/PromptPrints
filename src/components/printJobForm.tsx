import { useState } from 'react';

type PrintJobFormProps = {
    onSubmit: (jobData: any) => Promise<void>;
};

const PrintJobForm: React.FC<PrintJobFormProps> = ({ onSubmit }) => {
    const [fulfillmentOption, setFulfillmentOption] = useState('in-house');

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const jobData = {
            // Collect other job data
            fulfillmentOption,
        };
        await onSubmit(jobData);
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Other form fields */}
            <label>
                Fulfillment Option:
                <select value={fulfillmentOption} onChange={(e) => setFulfillmentOption(e.target.value)}>
                    <option value="in-house">In-House</option>
                    <option value="printful">Printful</option>
                </select>
            </label>
            <button type="submit">Submit Print Job</button>
        </form>
    );
};

export default PrintJobForm;
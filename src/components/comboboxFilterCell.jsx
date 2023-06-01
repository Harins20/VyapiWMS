import * as React from "react";
import { ComboBox } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
export const ComboboxFilterCell = (props) => {
  let hasValue = (value) => Boolean(value && value !== props.defaultItem);
  const onChange = (event) => {
    hasValue = hasValue(event.target.value);
    props.onChange({
      value: hasValue ? event.target.value : "",
      operator: hasValue ? "eq" : "",
      syntheticEvent: event.syntheticEvent,
    });
  };
  const onClearButtonClick = (event) => {
    event.preventDefault();
    props.onChange({
      value: "",
      operator: "",
      syntheticEvent: event,
    });
  };
  return (
      <div className="k-filtercell">
          <ComboBox
              style={{
                  width: '100%',
              }}
              data={props.data}
              textField="description"
              dataItemKey="code"
              value={props.value || props.defaultItem}
              onChange={onChange}
          />
          <Button
              title="Clear"
              disabled={!hasValue(props.value)}
              onClick={onClearButtonClick}
              icon="filter-clear"
          />
    </div>
  );
};

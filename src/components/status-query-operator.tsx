import {
  Autocomplete,
  TextField,
} from "@mui/material";

import { GridFilterInputValueProps, GridFilterOperator, GridValidRowModel } from "@mui/x-data-grid";
import React from "react";



function StatusFilterInput<OptionsT>(props: GridFilterInputValueProps & {options?: OptionsT[]}) {
    const { item, applyValue, focusElementRef } = props;

React.useImperativeHandle(focusElementRef, () => ({
  focus: () => {
    document.getElementById('status-filter-input')?.focus();
  },
}));
  return (
    <Autocomplete
  disablePortal
  onChange={(e, v) => {
    applyValue({ ...item, value: v });
  }}
  options={props.options || []}
  sx={{  }}
  id="status-filter-input"

  renderInput={(params) => <TextField {...params} label="Status" />}
/>
  )
}



export function statusQueryOperator<T extends GridValidRowModel, OptionsT>(options: OptionsT[] = []): GridFilterOperator<T, string | number | boolean>[] {
const statusGridFilterOperator: GridFilterOperator<T, string | number | boolean>[] = [{
  label: "Status Equals",
  value: 'status_equals',
  getApplyFilterFn: (filterItem) => {
    if (!filterItem.value || typeof filterItem.value !== 'string') {
      return null;
    }
    return (value) => {
      return String(value).toLowerCase() === String(filterItem.value).toLowerCase();
    }
  },
  InputComponent: (props) => <StatusFilterInput<OptionsT> {...props} options={options} />,
  requiresFilterValue: true,
}]
 return statusGridFilterOperator;
}
import * as React from 'react';
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";

export default function BaseTable(props: {
    data: { id: number, columns: any[] }[];
    headers: string[];
    className: string;
    noRowsMessage: string;
}) {
    return <>
        {props.data.length === 0 ? <p className={"emptyMessage"}>{props.noRowsMessage}</p> :
            <Table className={props.className} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {props.headers.map(h => <TableCell align="left">{h}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.data.map((d: { id: number, columns: any[] }, i: number) => (
                        <TableRow
                            key={d.id}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            {d.columns.map(c => <TableCell align="left">{c}</TableCell>)}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        }
    </>;
}